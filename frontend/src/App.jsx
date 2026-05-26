import React, { useState, useEffect } from 'react';
import { 
  User, 
  Upload, 
  Activity, 
  FileText, 
  Layers, 
  Download, 
  Search, 
  Brain, 
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Info
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8008';

export default function App() {
  const [activeTab, setActiveTab] = useState('single');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Model info from backend
  const [modelInfo, setModelInfo] = useState(null);
  
  // Single prediction form state
  const [formData, setFormData] = useState({
    age: 38,
    gender: 'Female',
    income: 80000,
    spending_score: 50,
    membership_years: 3,
    purchase_frequency: 20,
    preferred_category: 'Groceries',
    last_purchase_amount: 250
  });
  
  const [singleResult, setSingleResult] = useState(null);
  
  // Batch upload state
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
      [name]: ['gender', 'preferred_category'].includes(name) ? value : parseFloat(value)
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
      setSingleResult(data);
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
    const svmStats = {};
    const knnStats = {};
    
    data.forEach(row => {
      const svmSeg = row.segment_name_svm;
      const knnSeg = row.segment_name_knn;
      
      svmStats[svmSeg] = (svmStats[svmSeg] || 0) + 1;
      knnStats[knnSeg] = (knnStats[knnSeg] || 0) + 1;
    });
    
    setSegmentStats({ svm: svmStats, knn: knnStats });
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
        // Handle values containing commas
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
    link.setAttribute("download", "customer_segmentation_predictions.csv");
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
      (row.segment_name_svm && row.segment_name_svm.toLowerCase().includes(searchLower)) ||
      (row.segment_name_knn && row.segment_name_knn.toLowerCase().includes(searchLower))
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentTableData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="logo-section">
          <div className="logo-icon">
            <Brain size={24} />
          </div>
          <div className="logo-text">
            <h1>Customer Segments</h1>
            <span>Data Mining Analytics Panel</span>
          </div>
        </div>
        
        <nav className="tab-navigation">
          <button 
            id="tab-btn-single"
            className={`tab-btn ${activeTab === 'single' ? 'active' : ''}`}
            onClick={() => setActiveTab('single')}
          >
            <User size={16} /> Individual Predictor
          </button>
          <button 
            id="tab-btn-batch"
            className={`tab-btn ${activeTab === 'batch' ? 'active' : ''}`}
            onClick={() => setActiveTab('batch')}
          >
            <Upload size={16} /> Batch CSV Upload
          </button>
          <button 
            id="tab-btn-insights"
            className={`tab-btn ${activeTab === 'insights' ? 'active' : ''}`}
            onClick={() => setActiveTab('insights')}
          >
            <Activity size={16} /> Model Insights
          </button>
        </nav>
      </header>

      {/* Error alert banner */}
      {error && (
        <div className="alert-banner" id="error-alert">
          <AlertTriangle size={20} />
          <div>
            <strong>Error:</strong> {error}
          </div>
          <button 
            style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: '#fca5a5', cursor: 'pointer' }}
            onClick={fetchModelInfo}
          >
            <RefreshCw size={16} />
          </button>
        </div>
      )}

      {/* Main Panel Content */}
      <main className="dashboard-content">
        {activeTab === 'single' && (
          <div className="grid-container">
            {/* Form */}
            <div className="card">
              <h2 className="card-title">
                <User size={20} /> Customer Characteristics
              </h2>
              <form onSubmit={handleSingleSubmit} className="form-grid">
                <div className="form-group">
                  <label htmlFor="input-age">
                    Age <span className="label-value">{formData.age} years</span>
                  </label>
                  <input 
                    id="input-age"
                    name="age"
                    type="range" 
                    min="18" 
                    max="80" 
                    value={formData.age}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="input-gender">Gender</label>
                  <select 
                    id="input-gender" 
                    name="gender" 
                    value={formData.gender} 
                    onChange={handleInputChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="input-income">
                    Annual Income ($) <span className="label-value">${formData.income.toLocaleString()}</span>
                  </label>
                  <input 
                    id="input-income" 
                    name="income"
                    type="number" 
                    min="10000" 
                    max="200000" 
                    step="500"
                    value={formData.income}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="input-spending">
                    Spending Score <span className="label-value">{formData.spending_score} / 100</span>
                  </label>
                  <input 
                    id="input-spending" 
                    name="spending_score"
                    type="range" 
                    min="1" 
                    max="100" 
                    value={formData.spending_score}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="input-membership">
                    Membership Tenure <span className="label-value">{formData.membership_years} years</span>
                  </label>
                  <input 
                    id="input-membership" 
                    name="membership_years"
                    type="range" 
                    min="1" 
                    max="15" 
                    value={formData.membership_years}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="input-frequency">
                    Annual Purchases <span className="label-value">{formData.purchase_frequency} times</span>
                  </label>
                  <input 
                    id="input-frequency" 
                    name="purchase_frequency"
                    type="range" 
                    min="1" 
                    max="50" 
                    value={formData.purchase_frequency}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="input-category">Preferred Category</label>
                  <select 
                    id="input-category" 
                    name="preferred_category"
                    value={formData.preferred_category}
                    onChange={handleInputChange}
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Groceries">Groceries</option>
                    <option value="Home & Garden">Home & Garden</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="input-last-purchase">
                    Last Purchase ($) <span className="label-value">${formData.last_purchase_amount.toLocaleString()}</span>
                  </label>
                  <input 
                    id="input-last-purchase" 
                    name="last_purchase_amount"
                    type="number" 
                    min="5" 
                    max="1500" 
                    step="5"
                    value={formData.last_purchase_amount}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group full-width">
                  <button 
                    id="btn-predict-single"
                    type="submit" 
                    className="btn-primary" 
                    disabled={loading}
                  >
                    {loading ? "Calculating Segments..." : "Classify Customer Segment"} <ArrowRight size={18} />
                  </button>
                </div>
              </form>
            </div>

            {/* Results Sidebar */}
            <div className="card">
              <h2 className="card-title">
                <Layers size={20} /> Segment Classification
              </h2>
              
              {!singleResult && !loading && (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem 0' }}>
                  <Info size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                  <p>Enter the customer's attributes on the left and click "Classify Customer Segment" to view predictive insights.</p>
                </div>
              )}

              {loading && (
                <div className="processing-overlay">
                  <div className="spinner"></div>
                  <p>Applying model pipelines...</p>
                </div>
              )}

              {singleResult && !loading && (
                <div className="results-section">
                  <div className="comparison-grid">
                    {/* SVM Result */}
                    <div 
                      className="model-result-card" 
                      style={{ '--accent-color': singleResult.predictions.svm.color }}
                      id="svm-prediction-card"
                    >
                      <div className="model-badge">SVM Classifier</div>
                      <div className="segment-name">{singleResult.predictions.svm.name}</div>
                      <div className="segment-description">{singleResult.predictions.svm.description}</div>
                    </div>

                    {/* KNN Result */}
                    <div 
                      className="model-result-card" 
                      style={{ '--accent-color': singleResult.predictions.knn.color }}
                      id="knn-prediction-card"
                    >
                      <div className="model-badge">KNN Classifier</div>
                      <div className="segment-name">{singleResult.predictions.knn.name}</div>
                      <div className="segment-description">{singleResult.predictions.knn.description}</div>
                    </div>
                  </div>

                  {/* Engineered Features */}
                  <div className="feature-info-box">
                    <div className="feature-info-title">Engineered Behavioral Features</div>
                    <div className="features-badges-grid">
                      <div className="feature-badge">
                        <span className="feature-badge-label">Spending Behavior</span>
                        <span className="feature-badge-value">
                          {singleResult.engineered_features.spending_behavior.toFixed(1)}
                        </span>
                      </div>
                      <div className="feature-badge">
                        <span className="feature-badge-label">Income-to-Spend</span>
                        <span className="feature-badge-value">
                          {singleResult.engineered_features.income_spending_ratio.toFixed(2)}
                        </span>
                      </div>
                      <div className="feature-badge">
                        <span className="feature-badge-label">Loyalty Tier</span>
                        <span className="feature-badge-value">
                          Tier {singleResult.engineered_features.loyalty_tier}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Legend Info */}
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', lineHeight: '1.4' }}>
                    <strong>Note:</strong> SVM (Support Vector Machine) and KNN (K-Nearest Neighbors) classification models predict which customer segment the input attributes belong to. The ground-truth segments were generated by a K-Means (K=3) clustering algorithm based on the customer income-to-spending ratio and raw spending score.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'batch' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Upload Area */}
            <div className="card">
              <h2 className="card-title">
                <Upload size={20} /> Bulk Customer CSV Analysis
              </h2>
              <div 
                className="upload-dropzone"
                onClick={() => document.getElementById('csv-file-input').click()}
              >
                <Upload className="upload-icon" />
                <div className="upload-text">
                  <strong>Click to select</strong> or drag and drop your customer CSV file here
                </div>
                <div className="upload-help-text">
                  File must contain columns: age, gender, income, spending_score, membership_years, purchase_frequency, preferred_category, last_purchase_amount
                </div>
                <input 
                  type="file" 
                  id="csv-file-input" 
                  className="file-input" 
                  accept=".csv" 
                  onChange={handleCSVUpload}
                />
              </div>

              {loading && (
                <div className="processing-overlay">
                  <div className="spinner"></div>
                  <p>Processing batch predictions. This may take a few seconds...</p>
                </div>
              )}
            </div>

            {/* Results Table */}
            {batchData.length > 0 && !loading && (
              <div className="card">
                <div className="batch-results-header">
                  <div>
                    <h2 className="card-title" style={{ margin: 0, border: 0 }}>
                      <FileText size={20} /> Batch Prediction Results
                    </h2>
                    <span className="batch-stats">Loaded {totalRecords} customers successfully</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className="search-input-wrapper">
                      <Search className="search-icon" />
                      <input 
                        id="table-search-input"
                        type="text" 
                        placeholder="Search records..." 
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCurrentPage(1);
                        }}
                      />
                    </div>
                    
                    <button 
                      id="btn-download-csv"
                      className="btn-primary" 
                      style={{ margin: 0, padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}
                      onClick={handleDownloadCSV}
                    >
                      <Download size={16} /> Download Predictions
                    </button>
                  </div>
                </div>

                {/* Grid Visual Distribution */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem', padding: '1rem 0', borderBottom: '1px solid var(--glass-border)' }}>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>SVM Segment Distribution</h4>
                    <div className="chart-bar-container">
                      {Object.entries(segmentStats.svm).map(([segment, count]) => {
                        const pct = ((count / totalRecords) * 100).toFixed(1);
                        let barColor = 'var(--accent-blue)';
                        if (segment === "High-Value Shopper") barColor = 'var(--accent-emerald)';
                        if (segment === "Low-Engagement Shopper") barColor = 'var(--accent-rose)';
                        return (
                          <div className="chart-bar-row" key={segment}>
                            <span className="chart-bar-label">{segment}</span>
                            <div className="chart-bar-outer">
                              <div className="chart-bar-inner" style={{ width: `${pct}%`, '--bar-color': barColor }}></div>
                            </div>
                            <span className="chart-bar-value">{count} ({pct}%)</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>KNN Segment Distribution</h4>
                    <div className="chart-bar-container">
                      {Object.entries(segmentStats.knn).map(([segment, count]) => {
                        const pct = ((count / totalRecords) * 100).toFixed(1);
                        let barColor = 'var(--accent-blue)';
                        if (segment === "High-Value Shopper") barColor = 'var(--accent-emerald)';
                        if (segment === "Low-Engagement Shopper") barColor = 'var(--accent-rose)';
                        return (
                          <div className="chart-bar-row" key={segment}>
                            <span className="chart-bar-label">{segment}</span>
                            <div className="chart-bar-outer">
                              <div className="chart-bar-inner" style={{ width: `${pct}%`, '--bar-color': barColor }}></div>
                            </div>
                            <span className="chart-bar-value">{count} ({pct}%)</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Age</th>
                        <th>Gender</th>
                        <th>Income ($)</th>
                        <th>Spend Score</th>
                        <th>Tenure</th>
                        <th>Freq</th>
                        <th>Last Spend</th>
                        <th>Spend Behavior</th>
                        <th>SVM Prediction</th>
                        <th>KNN Prediction</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentTableData.map((row, idx) => (
                        <tr key={idx}>
                          <td>{row.id || (currentPage - 1) * itemsPerPage + idx + 1}</td>
                          <td>{row.age ? Math.round(row.age * (80 - 18) + 18) : '-'}</td>
                          <td>{row.gender === 0 ? 'Male' : row.gender === 1 ? 'Female' : 'Other'}</td>
                          <td>${row.income ? Math.round(row.income * 200000) : '-'}</td>
                          <td>{row.spending_score ? Math.round(row.spending_score * 99 + 1) : '-'}</td>
                          <td>{row.membership_years || '-'} yrs</td>
                          <td>{row.purchase_frequency ? Math.round(row.purchase_frequency * 49 + 1) : '-'}</td>
                          <td>${row.last_purchase_amount ? Math.round(row.last_purchase_amount * 1500) : '-'}</td>
                          <td>{row.spending_behavior ? row.spending_behavior.toFixed(1) : '-'}</td>
                          <td>
                            <span 
                              className="table-badge" 
                              style={{ 
                                background: row.segment_name_svm === "High-Value Shopper" ? 'var(--accent-emerald)' : 
                                            row.segment_name_svm === "Low-Engagement Shopper" ? 'var(--accent-rose)' : 'var(--accent-blue)' 
                              }}
                            >
                              {row.segment_name_svm}
                            </span>
                          </td>
                          <td>
                            <span 
                              className="table-badge" 
                              style={{ 
                                background: row.segment_name_knn === "High-Value Shopper" ? 'var(--accent-emerald)' : 
                                            row.segment_name_knn === "Low-Engagement Shopper" ? 'var(--accent-rose)' : 'var(--accent-blue)' 
                              }}
                            >
                              {row.segment_name_knn}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Table Navigation controls */}
                <div className="pagination-controls">
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Showing page {currentPage} of {totalPages || 1} ({filteredData.length} records matching)
                  </span>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      id="btn-prev-page"
                      className="pagination-btn"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    >
                      Previous
                    </button>
                    <button 
                      id="btn-next-page"
                      className="pagination-btn"
                      disabled={currentPage === totalPages || totalPages === 0}
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'insights' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Overview */}
            <div className="card">
              <h2 className="card-title">
                <Brain size={20} /> Model Training Statistics
              </h2>
              <p className="description-text">
                The classification pipeline evaluates SVM (Support Vector Machine) and KNN (K-Nearest Neighbors) algorithms. The target labels represent the K-Means clusters (K=3) generated from the customer's income-to-spending ratio and raw spending score. 
              </p>
              
              {!modelInfo ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
                  <p>Loading model statistics from the server...</p>
                </div>
              ) : (
                <div className="metrics-grid">
                  {/* SVM Stats */}
                  <div className="metric-card">
                    <div className="metric-header">
                      <div className="metric-value-box">
                        <span className="metric-value">{(modelInfo.metrics.svm.accuracy * 100).toFixed(1)}%</span>
                        <span className="metric-label">SVM Classification Accuracy</span>
                      </div>
                      <TrendingUp size={32} style={{ color: 'var(--accent-emerald)' }} />
                    </div>
                    
                    <div style={{ marginTop: '1rem' }}>
                      <h4 style={{ fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Detailed Classification Report</h4>
                      <div className="table-wrapper">
                        <table className="report-table">
                          <thead>
                            <tr>
                              <th>Segment class</th>
                              <th>Precision</th>
                              <th>Recall</th>
                              <th>F1-Score</th>
                            </tr>
                          </thead>
                          <tbody>
                            {['0', '1', '2'].map(cls => {
                              const report = modelInfo.metrics.svm.classification_report[cls];
                              const segName = modelInfo.segments[cls]?.name || `Segment ${cls}`;
                              return (
                                <tr key={cls}>
                                  <td><strong>{segName}</strong></td>
                                  <td>{report.precision.toFixed(3)}</td>
                                  <td>{report.recall.toFixed(3)}</td>
                                  <td>{report['f1-score'].toFixed(3)}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* KNN Stats */}
                  <div className="metric-card">
                    <div className="metric-header">
                      <div className="metric-value-box">
                        <span className="metric-value">{(modelInfo.metrics.knn.accuracy * 100).toFixed(1)}%</span>
                        <span className="metric-label">KNN Classification Accuracy</span>
                      </div>
                      <TrendingUp size={32} style={{ color: 'var(--accent-blue)' }} />
                    </div>
                    
                    <div style={{ marginTop: '1rem' }}>
                      <h4 style={{ fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Detailed Classification Report</h4>
                      <div className="table-wrapper">
                        <table className="report-table">
                          <thead>
                            <tr>
                              <th>Segment class</th>
                              <th>Precision</th>
                              <th>Recall</th>
                              <th>F1-Score</th>
                            </tr>
                          </thead>
                          <tbody>
                            {['0', '1', '2'].map(cls => {
                              const report = modelInfo.metrics.knn.classification_report[cls];
                              const segName = modelInfo.segments[cls]?.name || `Segment ${cls}`;
                              return (
                                <tr key={cls}>
                                  <td><strong>{segName}</strong></td>
                                  <td>{report.precision.toFixed(3)}</td>
                                  <td>{report.recall.toFixed(3)}</td>
                                  <td>{report['f1-score'].toFixed(3)}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Segments Definition */}
            {modelInfo && (
              <div className="card">
                <h2 className="card-title">
                  <Layers size={20} /> Cluster Profiles & Marketing Segments
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {Object.entries(modelInfo.segments).map(([key, value]) => (
                    <div 
                      key={key} 
                      style={{ 
                        borderLeft: `4px solid ${value.color}`, 
                        paddingLeft: '1rem', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '0.25rem' 
                      }}
                    >
                      <h4 style={{ color: value.color, fontSize: '1.05rem', fontWeight: 700 }}>
                        {value.name} (Segment {key})
                      </h4>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {value.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
