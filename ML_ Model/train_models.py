import os
import json
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, MinMaxScaler, RobustScaler
from sklearn.cluster import KMeans
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib

def main():
    print("Starting ML Model Pipeline Training...")
    
    # 1. Paths
    base_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(base_dir, 'customer_segmentation_data.csv')
    models_dir = os.path.join(os.path.dirname(base_dir), 'backend', 'models')
    os.makedirs(models_dir, exist_ok=True)
    
    print(f"Loading data from: {csv_path}")
    df_raw = pd.read_csv(csv_path)
    
    # Fill nulls if any (safety check)
    df = df_raw.copy()
    
    # 2. Categorical mapping
    df['gender'] = df['gender'].map({'Male': 0, 'Female': 1, 'Other': 2})
    df['preferred_category'] = df['preferred_category'].map({
        'Electronics': 0,
        'Clothing': 1,
        'Groceries': 2,
        'Home & Garden': 3,
        'Sports': 4
    })
    
    # Fill any potential missing values in mapped categories
    df['gender'] = df['gender'].fillna(0).astype(int)
    df['preferred_category'] = df['preferred_category'].fillna(0).astype(int)
    
    # 3. Add spending_behavior before scaling (using raw values)
    # spending_behavior = spending_score * purchase_frequency
    df['spending_behavior'] = df['spending_score'] * df['purchase_frequency']
    
    # 4. Scale features
    # MinMax scaling for: age, spending_score, purchase_frequency, spending_behavior
    minmax_cols = ['age', 'spending_score', 'purchase_frequency', 'spending_behavior']
    minmax_scaler = MinMaxScaler()
    df[minmax_cols] = minmax_scaler.fit_transform(df[minmax_cols])
    
    # robust income-to-spending ratio feature
    df['income_spending_ratio'] = np.log1p(np.abs(df['income'])) / (np.log1p(np.abs(df['last_purchase_amount'])) + 1e-6)
    robust_scaler = RobustScaler()
    df['income_spending_ratio'] = robust_scaler.fit_transform(df[['income_spending_ratio']])
    
    # Standardize monetary features
    std_cols = ['income', 'last_purchase_amount']
    std_scaler = StandardScaler()
    df[std_cols] = std_scaler.fit_transform(df[std_cols])
    
    # Convert membership years to loyalty tiers (0, 1, 2)
    df['loyalty_tier'] = pd.cut(df['membership_years'],
                               bins=[0, 2, 5, float('inf')],
                               labels=['0', '1', '2'])
    # Convert loyalty tier to integer to avoid category dtype issues
    df['loyalty_tier'] = df['loyalty_tier'].fillna('0').astype(int)
    
    # Drop unused raw columns
    df.drop(columns=['membership_years', 'id'], inplace=True, errors='ignore')
    
    # 5. K-Means Clustering to identify customer segments (using income_spending_ratio and spending_score)
    selected_features = ['income_spending_ratio', 'spending_score']
    X_cls = df[selected_features].values
    
    kmeans = KMeans(n_clusters=3, init='k-means++', n_init=10, random_state=42)
    df['KMeans_Cluster'] = kmeans.fit_predict(X_cls)
    
    # Print cluster details
    print(f"K-Means clusters generated. Segment sizes:")
    print(df['KMeans_Cluster'].value_counts())
    
    # 6. Prepare dataset for classification
    # Keep the same features list
    feature_cols = [
        'age', 'gender', 'income', 'spending_score', 'purchase_frequency', 
        'preferred_category', 'last_purchase_amount', 'spending_behavior', 
        'income_spending_ratio', 'loyalty_tier'
    ]
    X = df[feature_cols]
    y = df['KMeans_Cluster']
    
    # Split into train/test
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, 
        test_size=0.3, 
        random_state=42
    )
    
    # 7. Train SVM
    print("Training SVM Classifier...")
    svm = SVC(kernel='rbf', probability=True, random_state=42)
    svm.fit(X_train, y_train)
    y_pred_svm = svm.predict(X_test)
    svm_acc = accuracy_score(y_test, y_pred_svm)
    print(f"SVM Accuracy: {svm_acc:.4f}")
    print(classification_report(y_test, y_pred_svm))
    
    # 8. Train KNN
    print("Training KNN Classifier...")
    knn = KNeighborsClassifier(n_neighbors=5)
    knn.fit(X_train, y_train)
    y_pred_knn = knn.predict(X_test)
    knn_acc = accuracy_score(y_test, y_pred_knn)
    print(f"KNN Accuracy: {knn_acc:.4f}")
    print(classification_report(y_test, y_pred_knn))
    
    # 9. Save all artifacts using joblib
    print(f"Saving models and scalers to: {models_dir}")
    joblib.dump(kmeans, os.path.join(models_dir, 'kmeans.joblib'))
    joblib.dump(svm, os.path.join(models_dir, 'svm.joblib'))
    joblib.dump(knn, os.path.join(models_dir, 'knn.joblib'))
    joblib.dump(minmax_scaler, os.path.join(models_dir, 'minmax_scaler.joblib'))
    joblib.dump(robust_scaler, os.path.join(models_dir, 'robust_scaler.joblib'))
    joblib.dump(std_scaler, os.path.join(models_dir, 'standard_scaler.joblib'))
    
    # Save feature names list to ensure exact ordering in inference
    with open(os.path.join(models_dir, 'features.json'), 'w') as f:
        json.dump(feature_cols, f)
        
    # Save performance metrics metadata
    metrics = {
        "svm": {
            "accuracy": float(svm_acc),
            "classification_report": classification_report(y_test, y_pred_svm, output_dict=True)
        },
        "knn": {
            "accuracy": float(knn_acc),
            "classification_report": classification_report(y_test, y_pred_knn, output_dict=True)
        }
    }
    with open(os.path.join(models_dir, 'metrics.json'), 'w') as f:
        json.dump(metrics, f, indent=4)
        
    print("Model pipeline training and serialization complete!")

if __name__ == '__main__':
    main()
