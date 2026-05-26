import React, { useState, useEffect } from 'react';
import { Upload, Search, Download, Database, AlertTriangle, RefreshCw } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8008';

export default function DataExplorer({
  batchData,
  totalRecords,
  searchTerm,
  currentPage,
  itemsPerPage,
  loading,
  setSearchTerm,
  setCurrentPage,
  handleCSVUpload,
  handleDownloadCSV,
  currentTableData,
  segmentStats,
  totalPages,
  filteredData
}) {
  const [dbCustomers, setDbCustomers] = useState([]);
  const [dbFetchError, setDbFetchError] = useState(false);
  const [dbLoading, setDbLoading] = useState(false);
  
  // Local pagination state for database view (when not viewing custom CSV uploads)
  const [localPage, setLocalPage] = useState(1);
  const [localSearch, setLocalSearch] = useState('');

  useEffect(() => {
    fetchDatabaseSamples();
  }, []);

  const fetchDatabaseSamples = async () => {
    setDbLoading(true);
    setDbFetchError(false);
    try {
      const res = await fetch(`${API_BASE_URL}/api/customers`);
      if (!res.ok) throw new Error("Database fetch failed");
      const data = await res.json();
      setDbCustomers(data);
    } catch (err) {
      console.error("Failed to fetch database samples:", err);
      setDbFetchError(true);
    } finally {
      setDbLoading(false);
    }
  };

  const isUploadedView = batchData.length > 0;

  // Local filtering & pagination for database samples
  const filteredDbData = dbCustomers.filter(row => {
    if (!localSearch) return true;
    const searchLower = localSearch.toLowerCase();
    return (
      (row.id && String(row.id).includes(searchLower)) ||
      (row.gender && String(row.gender).toLowerCase().includes(searchLower)) ||
      (row.preferred_category && String(row.preferred_category).toLowerCase().includes(searchLower))
    );
  });

  const localTotalPages = Math.ceil(filteredDbData.length / itemsPerPage);
  const currentDbTableData = filteredDbData.slice(
    (localPage - 1) * itemsPerPage,
    localPage * itemsPerPage
  );

  return (
    <div>
      {/* Explorer Error Banner */}
      {dbFetchError && (
        <div className="quality-alert-box" style={{ marginBottom: '2rem' }}>
          <div className="quality-alert-title">
            <AlertTriangle size={20} /> Explorer Error
          </div>
          <div className="quality-alert-desc">
            Failed to fetch dataset samples. Check database and backend status.
          </div>
          <button 
            className="btn-initialize-train" 
            style={{ padding: '0.45rem 1.25rem', width: 'fit-content', marginTop: '0.5rem', fontSize: '0.8rem' }}
            onClick={fetchDatabaseSamples}
          >
            <RefreshCw size={12} /> Retry Database Fetch
          </button>
        </div>
      )}

      {/* CSV Batch Upload Area */}
      <div className="card-styled" style={{ marginBottom: '2rem' }}>
        <div className="card-header-group">
          <h3 className="card-title-styled">Bulk Customer CSV Analysis</h3>
          <p className="card-subtitle-styled">Upload a file to run predictions on thousands of rows automatically</p>
        </div>
        
        <div 
          className="upload-dropzone"
          onClick={() => document.getElementById('csv-file-input').click()}
        >
          <Upload className="upload-icon" />
          <div className="upload-text">
            <strong>Click to select</strong> or drag and drop your customer CSV file here
          </div>
          <div className="upload-help-text">
            Expected schema: age, gender, income, spending_score, membership_years, purchase_frequency, preferred_category, last_purchase_amount
          </div>
          <input 
            type="file" 
            id="csv-file-input" 
            className="file-input" 
            accept=".csv" 
            onChange={handleCSVUpload}
          />
        </div>
      </div>

      {/* Loading overlay for CSV uploads */}
      {loading && (
        <div className="card-styled" style={{ alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
          <div className="spinner" style={{ marginBottom: '1.5rem' }}></div>
          <h3>Calculating Batch Predictions...</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Preprocessing datasets, executing SVM classification, and generating marketing clusters...</p>
        </div>
      )}

      {/* Table Section: Displays either uploaded CSV predictions OR default database table */}
      {!loading && (isUploadedView ? (
        // 1. CSV UPLOADED PREDICTIONS TABLE VIEW
        <div className="table-card">
          <div className="table-header-flex">
            <div>
              <h3 className="card-title-styled" style={{ margin: 0 }}>Batch Prediction Output</h3>
              <span className="pagination-text">Loaded {totalRecords} customer records successfully</span>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div className="search-container">
                <Search className="search-icon-svg" />
                <input 
                  type="text" 
                  placeholder="Filter results..."
                  className="search-field"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              
              <button 
                className="btn-header"
                onClick={handleDownloadCSV}
              >
                <Download size={14} /> Download Predictions
              </button>
            </div>
          </div>

          {/* Data Distribution stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem', padding: '1rem 0', borderBottom: '1px solid var(--border-color)' }}>
            <div>
              <h4 style={{ fontSize: '0.85rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>SVM Segment Distribution</h4>
              <div className="chart-bar-container">
                {Object.entries(segmentStats.svm).map(([segment, count]) => {
                  const pct = ((count / totalRecords) * 100).toFixed(1);
                  let barColor = '#3b82f6';
                  if (segment === "High-Value Shopper") barColor = '#10b981';
                  if (segment === "Low-Engagement Shopper") barColor = '#f43f5e';
                  return (
                    <div className="chart-bar-row" key={segment}>
                      <span className="chart-bar-label">{segment}</span>
                      <div className="chart-bar-outer">
                        <div className="chart-bar-inner" style={{ width: `${pct}%`, backgroundColor: barColor }}></div>
                      </div>
                      <span className="chart-bar-value">{count} ({pct}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.85rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>KNN Segment Distribution</h4>
              <div className="chart-bar-container">
                {Object.entries(segmentStats.knn).map(([segment, count]) => {
                  const pct = ((count / totalRecords) * 100).toFixed(1);
                  let barColor = '#3b82f6';
                  if (segment === "High-Value Shopper") barColor = '#10b981';
                  if (segment === "Low-Engagement Shopper") barColor = '#f43f5e';
                  return (
                    <div className="chart-bar-row" key={segment}>
                      <span className="chart-bar-label">{segment}</span>
                      <div className="chart-bar-outer">
                        <div className="chart-bar-inner" style={{ width: `${pct}%`, backgroundColor: barColor }}></div>
                      </div>
                      <span className="chart-bar-value">{count} ({pct}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Table */}
          <div className="table-container">
            <table className="table-styled">
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
                    <td>{row.age ? Math.round(row.age * (89 - 18) + 18) : '-'}</td>
                    <td>{row.gender === 0 ? 'Male' : row.gender === 1 ? 'Female' : 'Other'}</td>
                    <td>${row.income ? Math.round(row.income * 200000).toLocaleString() : '-'}</td>
                    <td>{row.spending_score ? Math.round(row.spending_score * 99 + 1) : '-'}</td>
                    <td>{row.membership_years || '-'} yrs</td>
                    <td>{row.purchase_frequency ? Math.round(row.purchase_frequency * 49 + 1) : '-'}</td>
                    <td>${row.last_purchase_amount ? Math.round(row.last_purchase_amount * 1500).toLocaleString() : '-'}</td>
                    <td>{row.spending_behavior ? row.spending_behavior.toFixed(1) : '-'}</td>
                    <td>
                      <span 
                        className="pill-badge" 
                        style={{ 
                          backgroundColor: row.segment_name_svm === "High-Value Shopper" ? '#10b981' : 
                                          row.segment_name_svm === "Low-Engagement Shopper" ? '#f43f5e' : '#3b82f6' 
                        }}
                      >
                        {row.segment_name_svm}
                      </span>
                    </td>
                    <td>
                      <span 
                        className="pill-badge" 
                        style={{ 
                          backgroundColor: row.segment_name_knn === "High-Value Shopper" ? '#10b981' : 
                                          row.segment_name_knn === "Low-Engagement Shopper" ? '#f43f5e' : '#3b82f6' 
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

          <div className="pagination-row">
            <span className="pagination-text">
              Showing page {currentPage} of {totalPages || 1} ({filteredData.length} records matching)
            </span>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className="pagination-btn-styled"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              >
                Previous
              </button>
              <button 
                className="pagination-btn-styled"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : (
        // 2. DEFAULT MALL DATABASE VIEW (When no CSV is uploaded)
        !dbLoading && dbCustomers.length > 0 && (
          <div className="table-card">
            <div className="table-header-flex">
              <div>
                <h3 className="card-title-styled" style={{ margin: 0 }}>Database Customer Records</h3>
                <span className="pagination-text">Displaying training data fetched directly from system file</span>
              </div>
              
              <div className="search-container">
                <Search className="search-icon-svg" />
                <input 
                  type="text" 
                  placeholder="Search database..."
                  className="search-field"
                  value={localSearch}
                  onChange={(e) => {
                    setLocalSearch(e.target.value);
                    setLocalPage(1);
                  }}
                />
              </div>
            </div>

            <div className="table-container">
              <table className="table-styled">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Annual Income ($)</th>
                    <th>Spending Score (1-100)</th>
                    <th>Membership Tenure</th>
                    <th>Purchase Frequency</th>
                    <th>Preferred Category</th>
                    <th>Last Purchase Amount ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDbTableData.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.id}</td>
                      <td>{row.age}</td>
                      <td>{row.gender}</td>
                      <td>${row.income.toLocaleString()}</td>
                      <td>{row.spending_score}</td>
                      <td>{row.membership_years} yrs</td>
                      <td>{row.purchase_frequency} times</td>
                      <td>{row.preferred_category}</td>
                      <td>${row.last_purchase_amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination-row">
              <span className="pagination-text">
                Showing page {localPage} of {localTotalPages || 1} ({filteredDbData.length} records matching)
              </span>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  className="pagination-btn-styled"
                  disabled={localPage === 1}
                  onClick={() => setLocalPage(prev => Math.max(prev - 1, 1))}
                >
                  Previous
                </button>
                <button 
                  className="pagination-btn-styled"
                  disabled={localPage === localTotalPages || localTotalPages === 0}
                  onClick={() => setLocalPage(prev => Math.min(prev + 1, localTotalPages))}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )
      ))}
    </div>
  );
}
