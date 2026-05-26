import os
import json
import numpy as np
import pandas as pd
import subprocess
import sys
from fastapi import FastAPI, HTTPException, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib

app = FastAPI(
    title="Customer Segmentation & Classification API",
    description="FastAPI Backend for predicting customer segments using SVM and KNN",
    version="1.0.0"
)

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the React app domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Global state for models and scalers
MODELS = {}
SCALERS = {}
METRICS = {}
FEATURE_COLS = []
SEGMENT_MAP = {
    0: {
        "name": "High-Value Shopper",
        "description": "High average purchase amount, high spending score, and high engagement.",
        "color": "#10b981"  # Emerald
    },
    1: {
        "name": "Low-Engagement Shopper",
        "description": "Highest income bracket but lowest spending score and very small purchase amounts.",
        "color": "#f43f5e"  # Rose
    },
    2: {
        "name": "Standard Shopper",
        "description": "Moderate income, average spending score, and moderate purchase amounts.",
        "color": "#3b82f6"  # Blue
    }
}

# 2. Startup Event to load models
@app.on_event("startup")
def load_assets():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    models_dir = os.path.join(base_dir, 'models')
    
    try:
        MODELS['kmeans'] = joblib.load(os.path.join(models_dir, 'kmeans.joblib'))
        MODELS['svm'] = joblib.load(os.path.join(models_dir, 'svm.joblib'))
        MODELS['knn'] = joblib.load(os.path.join(models_dir, 'knn.joblib'))
        
        SCALERS['minmax'] = joblib.load(os.path.join(models_dir, 'minmax_scaler.joblib'))
        SCALERS['robust'] = joblib.load(os.path.join(models_dir, 'robust_scaler.joblib'))
        SCALERS['standard'] = joblib.load(os.path.join(models_dir, 'standard_scaler.joblib'))
        
        # Load features list
        global FEATURE_COLS
        with open(os.path.join(models_dir, 'features.json'), 'r') as f:
            FEATURE_COLS = json.load(f)
            
        # Load metrics
        global METRICS
        with open(os.path.join(models_dir, 'metrics.json'), 'r') as f:
            METRICS = json.load(f)
            
        print("All models, scalers, and metadata loaded successfully!")
    except Exception as e:
        print(f"Error loading models or scalers: {e}")
        print("Please run train_models.py first to generate the models.")

# 3. Pydantic request models
class CustomerInput(BaseModel):
    age: float = Field(..., example=38, description="Age of the customer")
    gender: str = Field(..., example="Female", description="Gender (Male, Female, Other)")
    income: float = Field(..., example=99342.0, description="Annual Income")
    spending_score: float = Field(..., example=90.0, description="Spending Score (1-100)")
    membership_years: float = Field(..., example=3.0, description="Years of membership")
    purchase_frequency: float = Field(..., example=24.0, description="Number of purchases in the last year")
    preferred_category: str = Field(..., example="Groceries", description="Preferred purchase category")
    last_purchase_amount: float = Field(..., example=113.53, description="Amount spent on last purchase")

# 4. Helper function for data preprocessing
def preprocess_df(df_input: pd.DataFrame) -> pd.DataFrame:
    """
    Applies the exact preprocessing steps from the training pipeline.
    Expects df_input to contain: age, gender, income, spending_score, membership_years, purchase_frequency, preferred_category, last_purchase_amount
    """
    df = df_input.copy()
    
    # Text mapping
    df['gender'] = df['gender'].map({'Male': 0, 'Female': 1, 'Other': 2})
    df['preferred_category'] = df['preferred_category'].map({
        'Electronics': 0,
        'Clothing': 1,
        'Groceries': 2,
        'Home & Garden': 3,
        'Sports': 4
    })
    
    # Fill missing values if any mapping failed
    df['gender'] = df['gender'].fillna(0).astype(int)
    df['preferred_category'] = df['preferred_category'].fillna(0).astype(int)
    
    # Calculate spending behavior feature using raw values
    df['spending_behavior'] = df['spending_score'] * df['purchase_frequency']
    
    # Scale MinMax columns (needs to transform age, spending_score, purchase_frequency, spending_behavior)
    minmax_cols = ['age', 'spending_score', 'purchase_frequency', 'spending_behavior']
    df[minmax_cols] = SCALERS['minmax'].transform(df[minmax_cols])
    
    # Calculate income spending ratio and scale Robust
    df['income_spending_ratio'] = np.log1p(np.abs(df['income'])) / (np.log1p(np.abs(df['last_purchase_amount'])) + 1e-6)
    df['income_spending_ratio'] = SCALERS['robust'].transform(df[['income_spending_ratio']])
    
    # Scale Standard columns
    std_cols = ['income', 'last_purchase_amount']
    df[std_cols] = SCALERS['standard'].transform(df[std_cols])
    
    # Convert membership years to loyalty tiers
    df['loyalty_tier'] = pd.cut(df['membership_years'],
                               bins=[0, 2, 5, float('inf')],
                               labels=['0', '1', '2'])
    df['loyalty_tier'] = df['loyalty_tier'].fillna('0').astype(int)
    
    # Ensure columns match training features in exact order
    return df[FEATURE_COLS]

# 5. API Endpoints
@app.get("/")
def read_root():
    return {"message": "Customer Segmentation API is running. Go to /docs for OpenAPI documentation."}

@app.get("/api/model-info")
def get_model_info():
    if not METRICS:
        raise HTTPException(status_code=503, detail="Models or metrics metadata not loaded. Run train_models.py first.")
    return {
        "metrics": METRICS,
        "segments": SEGMENT_MAP
    }

@app.post("/api/predict/single")
def predict_single(customer: CustomerInput):
    if not MODELS:
        raise HTTPException(status_code=503, detail="Models are not loaded.")
        
    # Convert single input to DataFrame
    input_dict = customer.dict()
    df_raw = pd.DataFrame([input_dict])
    
    try:
        # Preprocess features
        X_scaled = preprocess_df(df_raw)
        
        # Predict clusters/segments
        pred_svm = MODELS['svm'].predict(X_scaled)[0]
        pred_knn = MODELS['knn'].predict(X_scaled)[0]
        
        # Get segment details
        segment_svm = SEGMENT_MAP.get(int(pred_svm), {"name": "Unknown", "description": "", "color": "#71717a"})
        segment_knn = SEGMENT_MAP.get(int(pred_knn), {"name": "Unknown", "description": "", "color": "#71717a"})
        
        # Calculate engineered feature values for display/debugging
        raw_spending_behavior = customer.spending_score * customer.purchase_frequency
        raw_income_spending_ratio = np.log1p(np.abs(customer.income)) / (np.log1p(np.abs(customer.last_purchase_amount)) + 1e-6)
        
        # Loyalty tier mapping
        if customer.membership_years <= 2:
            loyalty_tier = "0"
        elif customer.membership_years <= 5:
            loyalty_tier = "1"
        else:
            loyalty_tier = "2"
            
        return {
            "predictions": {
                "svm": {
                    "segment": int(pred_svm),
                    "name": segment_svm["name"],
                    "description": segment_svm["description"],
                    "color": segment_svm["color"]
                },
                "knn": {
                    "segment": int(pred_knn),
                    "name": segment_knn["name"],
                    "description": segment_knn["description"],
                    "color": segment_knn["color"]
                }
            },
            "engineered_features": {
                "spending_behavior": float(raw_spending_behavior),
                "income_spending_ratio": float(raw_income_spending_ratio),
                "loyalty_tier": loyalty_tier
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Inference error: {str(e)}")

@app.post("/api/predict/csv")
def predict_csv(file: UploadFile = File(...)):
    if not MODELS:
        raise HTTPException(status_code=503, detail="Models are not loaded.")
        
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed.")
        
    try:
        # Read uploaded CSV file
        df_uploaded = pd.read_csv(file.file)
        
        # Required columns validation
        required_cols = [
            'age', 'gender', 'income', 'spending_score', 'membership_years',
            'purchase_frequency', 'preferred_category', 'last_purchase_amount'
        ]
        
        missing_cols = [col for col in required_cols if col not in df_uploaded.columns]
        if missing_cols:
            raise HTTPException(
                status_code=400, 
                detail=f"CSV is missing required columns: {', '.join(missing_cols)}"
            )
            
        # Keep an copy of raw rows to return with predictions
        df_output = df_uploaded.copy()
        
        # Preprocess features
        X_scaled = preprocess_df(df_uploaded)
        
        # Run classification models
        preds_svm = MODELS['svm'].predict(X_scaled)
        preds_knn = MODELS['knn'].predict(X_scaled)
        
        # Append predictions to output DataFrame
        df_output['predicted_segment_svm'] = preds_svm
        df_output['segment_name_svm'] = df_output['predicted_segment_svm'].map(lambda x: SEGMENT_MAP.get(int(x), {}).get('name', 'Unknown'))
        
        df_output['predicted_segment_knn'] = preds_knn
        df_output['segment_name_knn'] = df_output['predicted_segment_knn'].map(lambda x: SEGMENT_MAP.get(int(x), {}).get('name', 'Unknown'))
        
        # Calculate engineered features for the output display
        df_output['spending_behavior'] = df_uploaded['spending_score'] * df_uploaded['purchase_frequency']
        df_output['income_spending_ratio'] = np.log1p(np.abs(df_uploaded['income'])) / (np.log1p(np.abs(df_uploaded['last_purchase_amount'])) + 1e-6)
        
        def assign_tier(years):
            if years <= 2:
                return "0"
            elif years <= 5:
                return "1"
            else:
                return "2"
        df_output['loyalty_tier'] = df_uploaded['membership_years'].map(assign_tier)
        
        # Convert to list of dicts for JSON response
        results = df_output.to_dict(orient='records')
        
        return {
            "total_records": len(results),
            "data": results
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process CSV file: {str(e)}")

@app.get("/api/customers")
def get_customers():
    try:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        csv_path = os.path.join(os.path.dirname(base_dir), 'ML_ Model', 'customer_segmentation_data.csv')
        
        if not os.path.exists(csv_path):
            raise FileNotFoundError(f"Database CSV file not found at {csv_path}")
            
        df = pd.read_csv(csv_path)
        # Convert to list of dicts
        results = df.to_dict(orient='records')
        return results
    except Exception as e:
        print(f"Error fetching dataset samples: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch dataset samples. Check database and backend status.")

def run_training_script():
    try:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        script_path = os.path.join(os.path.dirname(base_dir), 'ML_ Model', 'train_models.py')
        
        # Execute training script
        subprocess.run([sys.executable, script_path], check=True, cwd=os.path.dirname(script_path))
        
        # Reload assets
        load_assets()
        print("Models successfully re-trained and reloaded!")
    except Exception as e:
        print(f"Error compiling ensemble model: {e}")

@app.post("/api/train")
def train_ensemble(background_tasks: BackgroundTasks):
    background_tasks.add_task(run_training_script)
    return {"message": "Ensemble training compiled and started in background."}

