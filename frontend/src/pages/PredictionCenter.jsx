import React, { useState } from 'react';
import { Upload, Search, Download, Brain, RefreshCw, User, HelpCircle, Check, Sparkles } from 'lucide-react';

export default function PredictionCenter({
  formData,
  loading,
  handleInputChange,
  handleSingleSubmit,
  handleCSVUpload,
  batchData,
  singleResult,
  totalRecords,
  searchTerm,
  currentPage,
  itemsPerPage,
  setSearchTerm,
  setCurrentPage,
  handleDownloadCSV,
  currentTableData,
  filteredData,
  totalPages,
  modelInfo
}) {
  const [activeInputTab, setActiveInputTab] = useState('single'); // 'single' or 'csv'
  
  const segments = modelInfo?.segments || {
    0: { name: "High-Value Shopper", color: "#10b981", description: "High average purchase amount, high spending score, and high engagement." },
    1: { name: "Low-Engagement Shopper", color: "#f43f5e", description: "Highest income bracket but lowest spending score and very small purchase amounts." },
    2: { name: "Standard Shopper", color: "#3b82f6", description: "Moderate income, average spending score, and moderate purchase amounts." }
  };

  const segmentMeta = {
    0: { icon: '💎', subtitle: 'Premium High-Value', campaigns: ['VIP discounts', 'Luxury invites'] },
    1: { icon: '🚪', subtitle: 'Affluent Dormant', campaigns: ['Re-engagement deals', 'Special pop-ups'] },
    2: { icon: '🛍️', subtitle: 'Steady Value', campaigns: ['Bundle coupons', 'Cashback credit'] }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Input Selection Header Tabs */}
      <div className="grid-2-col" style={{ gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        <div className="card-styled" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
            <button 
              onClick={() => setActiveInputTab('single')}
              style={{
                flex: 1,
                padding: '1rem',
                background: 'none',
                border: 'none',
                color: activeInputTab === 'single' ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: 600,
                borderBottom: activeInputTab === 'single' ? '2px solid var(--accent-purple)' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'var(--transition-smooth)'
              }}
            >
              👤 Individual Customer Input
            </button>
            <button 
              onClick={() => setActiveInputTab('csv')}
              style={{
                flex: 1,
                padding: '1rem',
                background: 'none',
                border: 'none',
                color: activeInputTab === 'csv' ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: 600,
                borderBottom: activeInputTab === 'csv' ? '2px solid var(--accent-purple)' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'var(--transition-smooth)'
              }}
            >
              📄 Bulk CSV Batch Upload
            </button>
          </div>

          {activeInputTab === 'single' ? (
            /* 1. INDIVIDUAL FORM INPUTS */
            <form onSubmit={handleSingleSubmit} className="form-grid-styled">
              {/* Age */}
              <div className="form-group">
                <label htmlFor="age" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Age</span>
                  <span style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>{formData.age} yrs</span>
                </label>
                <input 
                  id="age"
                  name="age"
                  type="range" 
                  min="18" 
                  max="89" 
                  className="slider-styled"
                  value={formData.age}
                  onChange={handleInputChange}
                />
              </div>

              {/* Gender */}
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select 
                  id="gender" 
                  name="gender" 
                  className="select-styled"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Annual Income */}
              <div className="form-group">
                <label htmlFor="income">Annual Income ($)</label>
                <input 
                  id="income"
                  name="income"
                  type="number"
                  min="1000"
                  max="300000"
                  className="input-styled"
                  value={formData.income}
                  onChange={handleInputChange}
                  placeholder="e.g. 99342"
                />
              </div>

              {/* Spending Score */}
              <div className="form-group">
                <label htmlFor="spending_score" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Spending Score (1-100)</span>
                  <span style={{ color: 'var(--accent-teal)', fontWeight: 600 }}>{formData.spending_score}</span>
                </label>
                <input 
                  id="spending_score"
                  name="spending_score"
                  type="range"
                  min="1"
                  max="100"
                  className="slider-styled"
                  value={formData.spending_score}
                  onChange={handleInputChange}
                />
              </div>

              {/* Membership Tenure */}
              <div className="form-group">
                <label htmlFor="membership_years">Membership Tenure (Years)</label>
                <input 
                  id="membership_years"
                  name="membership_years"
                  type="number"
                  min="0"
                  max="50"
                  className="input-styled"
                  value={formData.membership_years}
                  onChange={handleInputChange}
                  placeholder="e.g. 3"
                />
              </div>

              {/* Purchase Frequency */}
              <div className="form-group">
                <label htmlFor="purchase_frequency">Purchase Frequency (Last Year)</label>
                <input 
                  id="purchase_frequency"
                  name="purchase_frequency"
                  type="number"
                  min="1"
                  max="100"
                  className="input-styled"
                  value={formData.purchase_frequency}
                  onChange={handleInputChange}
                  placeholder="e.g. 24"
                />
              </div>

              {/* Preferred Category */}
              <div className="form-group">
                <label htmlFor="preferred_category">Preferred Category</label>
                <select 
                  id="preferred_category" 
                  name="preferred_category" 
                  className="select-styled"
                  value={formData.preferred_category}
                  onChange={handleInputChange}
                >
                  <option value="Groceries">Groceries</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Home & Garden">Home & Garden</option>
                  <option value="Sports">Sports</option>
                </select>
              </div>

              {/* Last Purchase Amount */}
              <div className="form-group">
                <label htmlFor="last_purchase_amount">Last Purchase Amount ($)</label>
                <input 
                  id="last_purchase_amount"
                  name="last_purchase_amount"
                  type="number"
                  step="0.01"
                  min="1"
                  max="10000"
                  className="input-styled"
                  value={formData.last_purchase_amount}
                  onChange={handleInputChange}
                  placeholder="e.g. 113.53"
                />
              </div>

              <div className="form-group full-width" style={{ gridColumn: '1 / -1' }}>
                <button 
                  type="submit" 
                  className="btn-submit-predict" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="spinner" size={16} /> Running Models...
                    </>
                  ) : (
                    <>
                      🔮 Execute Dual-Model Segmentation
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* 2. CSV BATCH UPLOAD */
            <div style={{ padding: '1rem 0' }}>
              <div 
                className="upload-dropzone"
                onClick={() => document.getElementById('csv-file-input').click()}
                style={{
                  border: '2px dashed var(--border-glow)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '3rem 2rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: 'rgba(255, 255, 255, 0.01)',
                  transition: 'var(--transition-smooth)'
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) {
                    const event = { target: { files: [file] } };
                    handleCSVUpload(event);
                  }
                }}
              >
                <Upload className="upload-icon" style={{ margin: '0 auto 1rem', width: '48px', height: '48px', color: 'var(--accent-purple)' }} />
                <div style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.5rem', fontWeight: 600 }}>
                  Drag & drop your CSV file here, or browse
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 1.5rem', lineHeight: '1.4' }}>
                  The CSV must contain columns: <code style={{ color: 'var(--accent-teal)' }}>age, gender, income, spending_score, membership_years, purchase_frequency, preferred_category, last_purchase_amount</code>
                </p>
                <button type="button" className="pagination-btn-styled" style={{ padding: '0.5rem 1.5rem' }}>
                  Select CSV File
                </button>
                <input 
                  type="file" 
                  id="csv-file-input" 
                  style={{ display: 'none' }}
                  accept=".csv" 
                  onChange={handleCSVUpload}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SINGLE DUAL PREDICTION RESULTS DISPLAY */}
      {singleResult && activeInputTab === 'single' && !loading && (
        <div className="card-styled" style={{ padding: '1.75rem' }}>
          <div className="card-header-group" style={{ marginBottom: '1.25rem' }}>
            <h3 className="card-title-styled" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} style={{ color: 'var(--accent-purple)' }} /> Dual-Model Prediction Results
            </h3>
            <p className="card-subtitle-styled">Segment mapping comparison for the current shopper profile</p>
          </div>

          <div className="grid-2-col" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1rem' }}>
            
            {/* Logistic Prediction */}
            <div style={{
              background: 'rgba(255,255,255,0.015)',
              border: `1px solid ${segments[singleResult.logistic.segment]?.color}2e`,
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '100%',
                backgroundColor: segments[singleResult.logistic.segment]?.color
              }}></div>
              
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.5px', fontWeight: 600, marginBottom: '0.5rem' }}>
                Logistic Classifier
              </div>
              
              <h2 style={{ fontSize: '1.5rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', fontWeight: 700 }}>
                {segmentMeta[singleResult.logistic.segment]?.icon} {segments[singleResult.logistic.segment]?.name}
              </h2>
              <div style={{ fontSize: '0.85rem', color: segments[singleResult.logistic.segment]?.color, fontWeight: 600, marginBottom: '1rem' }}>
                {segmentMeta[singleResult.logistic.segment]?.subtitle}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '1rem' }}>
                {segments[singleResult.logistic.segment]?.description}
              </p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {segmentMeta[singleResult.logistic.segment]?.campaigns.map((camp, i) => (
                  <span key={i} className="campaign-tag" style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}>
                    {camp}
                  </span>
                ))}
              </div>
            </div>

            {/* KNN Prediction */}
            <div style={{
              background: 'rgba(255,255,255,0.015)',
              border: `1px solid ${segments[singleResult.knn.segment]?.color}2e`,
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '100%',
                backgroundColor: segments[singleResult.knn.segment]?.color
              }}></div>
              
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.5px', fontWeight: 600, marginBottom: '0.5rem' }}>
                KNN Classifier (k=5)
              </div>
              
              <h2 style={{ fontSize: '1.5rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', fontWeight: 700 }}>
                {segmentMeta[singleResult.knn.segment]?.icon} {segments[singleResult.knn.segment]?.name}
              </h2>
              <div style={{ fontSize: '0.85rem', color: segments[singleResult.knn.segment]?.color, fontWeight: 600, marginBottom: '1rem' }}>
                {segmentMeta[singleResult.knn.segment]?.subtitle}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '1rem' }}>
                {segments[singleResult.knn.segment]?.description}
              </p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {segmentMeta[singleResult.knn.segment]?.campaigns.map((camp, i) => (
                  <span key={i} className="campaign-tag" style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}>
                    {camp}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* DYNAMIC RESULTS TABLE (Matches Given Reference Image Layout & Headers) */}
      {(batchData.length > 0 || singleResult) && (
        <div className="table-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-premium)' }}>
          <div className="table-header-flex">
            <div>
              <h3 className="card-title-styled" style={{ margin: 0 }}>Predicted Customer Profiles</h3>
              <span className="pagination-text">
                Loaded {totalRecords} records matching the current analysis run
              </span>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div className="search-container">
                <Search className="search-icon-svg" />
                <input 
                  type="text" 
                  placeholder="Filter table rows..."
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
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 1.25rem',
                  fontSize: '0.85rem'
                }}
              >
                <Download size={14} /> Download CSV
              </button>
            </div>
          </div>

          {/* Table Container with exact given image columns and styling */}
          <div className="table-container" style={{ overflowX: 'auto' }}>
            <table className="table-styled" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600 }}>ID</th>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600 }}>Age</th>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600 }}>Gender</th>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600 }}>Annual Income ($)</th>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600 }}>Spending Score (1-100)</th>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600 }}>Membership Tenure</th>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600 }}>Purchase Frequency</th>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600 }}>Preferred Category</th>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600 }}>Last Purchase Amount ($)</th>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600 }}>Logistic Prediction</th>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600 }}>KNN Prediction</th>
                </tr>
              </thead>
              <tbody>
                {currentTableData.map((row, idx) => {
                  const rawLogisticVal = row.predicted_segment_logistic;
                  const rawKnnVal = row.predicted_segment_knn;

                  const logisticName = segments[rawLogisticVal]?.name || 'Unknown';
                  const logisticColor = segments[rawLogisticVal]?.color || '#71717a';

                  const knnName = segments[rawKnnVal]?.name || 'Unknown';
                  const knnColor = segments[rawKnnVal]?.color || '#71717a';

                  // Exact formatting matching given reference image
                  const formattedIncome = `$${Math.round(row.income).toLocaleString()}`;
                  const formattedTenure = `${row.membership_years} yrs`;
                  const formattedFreq = `${row.purchase_frequency} times`;
                  const formattedLastSpend = `$${row.last_purchase_amount.toFixed(2)}`;

                  return (
                    <tr 
                      key={idx} 
                      style={{ 
                        borderBottom: '1px solid var(--border-color)',
                        transition: 'var(--transition-smooth)',
                        background: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.01)'
                      }}
                      className="table-row-hover"
                    >
                      <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {row.id || (currentPage - 1) * itemsPerPage + idx + 1}
                      </td>
                      <td style={{ padding: '1rem', color: '#fff', fontWeight: 500 }}>{row.age}</td>
                      <td style={{ padding: '1rem', color: '#fff' }}>{row.gender}</td>
                      <td style={{ padding: '1rem', color: '#fff', fontFamily: 'monospace' }}>{formattedIncome}</td>
                      <td style={{ padding: '1rem', color: '#fff', textAlign: 'center' }}>{row.spending_score}</td>
                      <td style={{ padding: '1rem', color: '#fff' }}>{formattedTenure}</td>
                      <td style={{ padding: '1rem', color: '#fff' }}>{formattedFreq}</td>
                      <td style={{ padding: '1rem', color: '#fff' }}>{row.preferred_category}</td>
                      <td style={{ padding: '1rem', color: '#fff', fontFamily: 'monospace' }}>{formattedLastSpend}</td>
                      
                      {/* Logistic badge */}
                      <td style={{ padding: '1rem' }}>
                        <span 
                          style={{ 
                            backgroundColor: `${logisticColor}1a`, 
                            color: logisticColor, 
                            border: `1px solid ${logisticColor}40`,
                            padding: '0.35rem 0.75rem',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            display: 'inline-block',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {logisticName.split(' ')[0]} {/* Shorten name for space */}
                        </span>
                      </td>

                      {/* KNN badge */}
                      <td style={{ padding: '1rem' }}>
                        <span 
                          style={{ 
                            backgroundColor: `${knnColor}1a`, 
                            color: knnColor, 
                            border: `1px solid ${knnColor}40`,
                            padding: '0.35rem 0.75rem',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            display: 'inline-block',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {knnName.split(' ')[0]}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination bar */}
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
      )}
      
    </div>
  );
}
