import React, { useState, useEffect } from 'react';
import { 
  User, 
  Activity, 
  Layers, 
  Brain, 
  TrendingUp,
  Database,
} from 'lucide-react';

// Import Modular Page Components
import Dashboard from './pages/Dashboard';
import LogisticModel from './pages/LogisticModel';
import KnnModel from './pages/KnnModel';
import PredictionCenter from './pages/PredictionCenter';
import DataExplorer from './pages/DataExplorer';

const API_BASE_URL = 'https://tek-project.onrender.com';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Model info from backend
  const [modelInfo, setModelInfo] = useState(null);
  
  // Predict Segment form state
  const [formData, setFormData] = useState({
    age: 38,
    gender: 'Female',
    income: 99342,
    spending_score: 90,
    membership_years: 3,
    purchase_frequency: 24,
    preferred_category: 'Groceries',
    last_purchase_amount: 113.53
  });
  
  const [singleResult, setSingleResult] = useState(null);
  
  // Batch upload state (inside Data Explorer)
  const [batchData, setBatchData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [segmentStats, setSegmentStats] = useState({ svm: {}, knn: {} });
  const itemsPerPage = 10;

  // Fetch model metadata on mount
  useEffect(() => {
    fetchModelInfo();
  }, []);

  const fetchModelInfo = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/model-info`);
      if (!res.ok) throw new Error("Could not retrieve model details from the server.");
      const data = await res.json();
      setModelInfo(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the backend API. Please make sure the FastAPI server is running on port 8008.");
    }
  };

  // Form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['age', 'income', 'spending_score', 'membership_years', 'purchase_frequency', 'last_purchase_amount'].includes(name) ? parseFloat(value) : value
    }));
  };

  // Form submit for single prediction
  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/predict/single`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) {
        const errDetail = await res.json();
        throw new Error(errDetail.detail || "Server failed to compute segment.");
      }
      const data = await res.json();
      
      const resLogistic = data.predictions.logistic;
      const resKnn = data.predictions.knn;

      setSingleResult({
        logistic: resLogistic,
        knn: resKnn
      });

      // Append to the list of customer records in the table view
      const newCustomerRow = {
        id: batchData.length + 1,
        age: formData.age,
        gender: formData.gender,
        income: formData.income,
        spending_score: formData.spending_score,
        membership_years: formData.membership_years,
        purchase_frequency: formData.purchase_frequency,
        preferred_category: formData.preferred_category,
        last_purchase_amount: formData.last_purchase_amount,
        predicted_segment_logistic: resLogistic.segment,
        predicted_segment_knn: resKnn.segment
      };

      setBatchData(prev => [newCustomerRow, ...prev]);
      setTotalRecords(prev => prev + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // CSV Drag and Drop Upload handler
  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setLoading(true);
    setError(null);
    
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/predict/csv`, {
        method: 'POST',
        body: uploadFormData
      });
      if (!res.ok) {
        const errDetail = await res.json();
        throw new Error(errDetail.detail || "Server failed to parse and predict the CSV rows.");
      }
      const result = await res.json();
      setBatchData(result.data);
      setTotalRecords(result.total_records);
      setCurrentPage(1);
      
      // Calculate Stats
      calculateStats(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const logisticStats = {};
    const knnStats = {};
    
    data.forEach(row => {
      const logisticSeg = row.segment_name_logistic;
      const knnSeg = row.segment_name_knn;
      
      logisticStats[logisticSeg] = (logisticStats[logisticSeg] || 0) + 1;
      knnStats[knnSeg] = (knnStats[knnSeg] || 0) + 1;
    });
    
    setSegmentStats({ logistic: logisticStats, knn: knnStats });
  };

  // Convert processed data to downloadable CSV
  const handleDownloadCSV = () => {
    if (batchData.length === 0) return;
    
    // Header
    const headers = Object.keys(batchData[0]);
    const csvRows = [headers.join(',')];
    
    // Content rows
    batchData.forEach(row => {
      const values = headers.map(header => {
        const val = row[header];
        if (typeof val === 'string' && val.includes(',')) {
          return `"${val}"`;
        }
        return val;
      });
      csvRows.push(values.join(','));
    });
    
    // Download triggers
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "mall_customer_segmentation_predictions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pagination and Filtering logic
  const filteredData = batchData.filter(row => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      (row.id && String(row.id).includes(searchLower)) ||
      (row.gender && String(row.gender).toLowerCase().includes(searchLower)) ||
      (row.preferred_category && String(row.preferred_category).toLowerCase().includes(searchLower)) ||
      (row.segment_name_logistic && row.segment_name_logistic.toLowerCase().includes(searchLower)) ||
      (row.segment_name_knn && row.segment_name_knn.toLowerCase().includes(searchLower))
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentTableData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Segment Static Visuals Definition for display
  const segmentMetadata = {
    'A': {
      name: 'Segment A',
      subtitle: 'Premium High-Value',
      color: '#8b5cf6',
      description: 'High-spending, well-educated professionals. Respond to luxury products and exclusive offers.',
      campaigns: ['Luxury brands', 'Premium memberships', 'Exclusive events', 'Personalized services']
    },
    'B': {
      name: 'Segment B',
      subtitle: 'Stable Mid-Range',
      color: '#10b981',
      description: 'Married, mid-career professionals with steady spending patterns.',
      campaigns: ['Family packages', 'Loyalty programs', 'Value bundles', 'Seasonal promotions']
    },
    'C': {
      name: 'Segment C',
      subtitle: 'Moderate Spenders',
      color: '#f97316',
      description: 'Educated individuals with average spending. Respond well to quality-value balance.',
      campaigns: ['Mid-range products', 'Weekend deals', 'Quality brands', 'Combo offers']
    },
    'D': {
      name: 'Segment D',
      subtitle: 'Budget Conscious',
      color: '#f43f5e',
      description: 'Younger, single customers with lower spending. Price-sensitive and deal-driven.',
      campaigns: ['Discount offers', 'Flash sales', 'Budget-friendly options', 'Cashback deals']
    }
  };

  // Quality check configuration
  const qualityCheckData = [
    { name: 'ID', count: 0, percentage: '0.0% empty', status: 'clean' },
    { name: 'AGE', count: 0, percentage: '0.0% empty', status: 'clean' },
    { name: 'GENDER', count: 0, percentage: '0.0% empty', status: 'clean' },
    { name: 'INCOME', count: 0, percentage: '0.0% empty', status: 'clean' },
    { name: 'SPENDING_SCORE', count: 0, percentage: '0.0% empty', status: 'clean' },
    { name: 'MEMBERSHIP_YEARS', count: 0, percentage: '0.0% empty', status: 'clean' },
    { name: 'PURCHASE_FREQUENCY', count: 0, percentage: '0.0% empty', status: 'clean' },
    { name: 'PREFERRED_CATEGORY', count: 0, percentage: '0.0% empty', status: 'clean' },
    { name: 'LAST_PURCHASE_AMOUNT', count: 0, percentage: '0.0% empty', status: 'clean' }
  ];

  return (
    <div className="app-wrapper">
      
      {/* PERSISTENT SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-top">
          
          {/* Logo container */}
          <div className="logo-container">
            <div className="logo-symbol">
              <Layers size={22} />
            </div>
            <div className="logo-text-group">
              <span className="logo-title">MallIQ</span>
              <span className="logo-subtitle">Customer Intelligence</span>
            </div>
          </div>
          
          {/* Nav Section */}
          <div>
            <h3 className="nav-heading">Navigation</h3>
            <ul className="nav-list">
              <li 
                className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <Activity /> Dashboard
              </li>
              <li 
                className={`nav-item ${activeTab === 'logistic' ? 'active' : ''}`}
                onClick={() => setActiveTab('logistic')}
              >
                <Brain /> Logistic Model
              </li>
              <li 
                className={`nav-item ${activeTab === 'knn' ? 'active' : ''}`}
                onClick={() => setActiveTab('knn')}
              >
                <Brain /> KNN Model
              </li>
              <li 
                className={`nav-item ${activeTab === 'predict_center' ? 'active' : ''}`}
                onClick={() => setActiveTab('predict_center')}
              >
                <Layers /> Prediction Center
              </li>
              <li 
                className={`nav-item ${activeTab === 'explorer' ? 'active' : ''}`}
                onClick={() => setActiveTab('explorer')}
              >
                <Database /> Data Explorer
              </li>
            </ul>
          </div>
        </div>
        
        {/* Model Status block at bottom */}
        <div className="sidebar-bottom">
          <div className="status-box">
            <span className="status-label">Model Status</span>
            <div className="status-badge">
              <span className="status-dot"></span>
              Ready
            </div>
          </div>
        </div>
      </aside>
      
      {/* MAIN CONTENT AREA */}
      <main className="content-panel">
        
        <header className="main-header">
          <div className="main-header-info">
            <h2>
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'logistic' && 'Logistic Model Insights'}
              {activeTab === 'knn' && 'KNN Model Insights'}
              {activeTab === 'predict_center' && 'Prediction Center'}
              {activeTab === 'explorer' && 'Data Explorer'}
            </h2>
            <p>
              {activeTab === 'dashboard' && 'Overview of customer segmentation insights'}
              {activeTab === 'logistic' && 'Accuracy, correlation heatmap, and Logistic classifications'}
              {activeTab === 'knn' && 'Accuracy, correlation heatmap, and KNN classifications'}
              {activeTab === 'predict_center' && 'Perform individual or bulk CSV segmentation predictions'}
              {activeTab === 'explorer' && 'Browse database training customer records'}
            </p>
          </div>
          <div className="header-badge">
            <Database size={14} /> Shopping Mall Segmentation System
          </div>
        </header>

        {/* Dynamic Pages Rendering */}
        {activeTab === 'dashboard' && (
          <Dashboard />
        )}

        {activeTab === 'logistic' && (
          <LogisticModel modelInfo={modelInfo} />
        )}

        {activeTab === 'knn' && (
          <KnnModel modelInfo={modelInfo} />
        )}

        {activeTab === 'predict_center' && (
          <PredictionCenter 
            formData={formData}
            loading={loading}
            handleInputChange={handleInputChange}
            handleSingleSubmit={handleSingleSubmit}
            handleCSVUpload={handleCSVUpload}
            batchData={batchData}
            singleResult={singleResult}
            totalRecords={totalRecords}
            searchTerm={searchTerm}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            setSearchTerm={setSearchTerm}
            setCurrentPage={setCurrentPage}
            handleDownloadCSV={handleDownloadCSV}
            currentTableData={currentTableData}
            filteredData={filteredData}
            totalPages={totalPages}
            modelInfo={modelInfo}
          />
        )}

        {activeTab === 'explorer' && (
          <DataExplorer 
            batchData={batchData}
            totalRecords={totalRecords}
            searchTerm={searchTerm}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            loading={loading}
            setSearchTerm={setSearchTerm}
            setCurrentPage={setCurrentPage}
            handleCSVUpload={handleCSVUpload}
            handleDownloadCSV={handleDownloadCSV}
            currentTableData={currentTableData}
            segmentStats={segmentStats}
            totalPages={totalPages}
            filteredData={filteredData}
          />
        )}

      </main>
    </div>
  );
}
