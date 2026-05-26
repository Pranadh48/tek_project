import React from 'react';
import { TrendingUp, Layers, User } from 'lucide-react';

export default function Analytics({ qualityCheckData }) {
  return (
    <div>
      {/* Top Cards for Mean, Median, Min, Max */}
      <div className="metrics-grid-4" style={{ marginBottom: '1.5rem' }}>
        <div className="metric-card-styled" style={{ '--accent-gradient': 'linear-gradient(to right, #8b5cf6, #3b82f6)', padding: '1.25rem' }}>
          <div className="metric-icon-wrapper" style={{ backgroundColor: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6', width: '32px', height: '32px' }}>
            <TrendingUp size={16} />
          </div>
          <div className="metric-value-large" style={{ fontSize: '1.85rem' }}>43.8°</div>
          <div className="metric-label-small" style={{ fontSize: '0.75rem' }}>Mean Age</div>
        </div>
        
        <div className="metric-card-styled" style={{ '--accent-gradient': 'linear-gradient(to right, #10b981, #06b6d4)', padding: '1.25rem' }}>
          <div className="metric-icon-wrapper" style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#10b981', width: '32px', height: '32px' }}>
            <Layers size={16} />
          </div>
          <div className="metric-value-large" style={{ fontSize: '1.85rem' }}>45</div>
          <div className="metric-label-small" style={{ fontSize: '0.75rem' }}>Median Age</div>
        </div>
        
        <div className="metric-card-styled" style={{ '--accent-gradient': 'linear-gradient(to right, #f97316, #facc15)', padding: '1.25rem' }}>
          <div className="metric-icon-wrapper" style={{ backgroundColor: 'rgba(249, 115, 22, 0.12)', color: '#f97316', width: '32px', height: '32px' }}>
            <User size={16} />
          </div>
          <div className="metric-value-large" style={{ fontSize: '1.85rem' }}>18</div>
          <div className="metric-label-small" style={{ fontSize: '0.75rem' }}>Minimum Age</div>
        </div>
        
        <div className="metric-card-styled" style={{ '--accent-gradient': 'linear-gradient(to right, #ec4899, #f43f5e)', padding: '1.25rem' }}>
          <div className="metric-icon-wrapper" style={{ backgroundColor: 'rgba(236, 72, 153, 0.12)', color: '#ec4899', width: '32px', height: '32px' }}>
            <User size={16} />
          </div>
          <div className="metric-value-large" style={{ fontSize: '1.85rem' }}>69</div>
          <div className="metric-label-small" style={{ fontSize: '0.75rem' }}>Maximum Age</div>
        </div>
      </div>

      {/* Grid Row 1: Category Breakdown & Gender Breakdown */}
      <div className="grid-2-col" style={{ marginBottom: '1.5rem' }}>
        
        {/* Preferred Category Breakdown Horizontal bar chart */}
        <div className="card-styled">
          <div className="card-header-group">
            <h3 className="card-title-styled">Preferred Category Breakdown</h3>
            <p className="card-subtitle-styled">Major purchase categories across the mall customer database</p>
          </div>
          <div className="horizontal-bar-chart">
            <div className="h-bar-container">
              <span className="h-bar-label">Electronics</span>
              <div className="h-bar-track"><div className="h-bar-fill" style={{ width: '100%', backgroundColor: '#10b981' }}></div></div>
              <span className="h-bar-value">215</span>
            </div>
            <div className="h-bar-container">
              <span className="h-bar-label">Sports</span>
              <div className="h-bar-track"><div className="h-bar-fill" style={{ width: '97.6%', backgroundColor: '#10b981' }}></div></div>
              <span className="h-bar-value">210</span>
            </div>
            <div className="h-bar-container">
              <span className="h-bar-label">Home & Garden</span>
              <div className="h-bar-track"><div className="h-bar-fill" style={{ width: '95.8%', backgroundColor: '#10b981' }}></div></div>
              <span className="h-bar-value">206</span>
            </div>
            <div className="h-bar-container">
              <span className="h-bar-label">Groceries</span>
              <div className="h-bar-track"><div className="h-bar-fill" style={{ width: '92.5%', backgroundColor: '#10b981' }}></div></div>
              <span className="h-bar-value">199</span>
            </div>
            <div className="h-bar-container">
              <span className="h-bar-label">Clothing</span>
              <div className="h-bar-track"><div className="h-bar-fill" style={{ width: '79%', backgroundColor: '#10b981' }}></div></div>
              <span className="h-bar-value">170</span>
            </div>
          </div>
        </div>
        
        {/* Gender Breakdown Donut Chart */}
        <div className="card-styled">
          <div className="card-header-group">
            <h3 className="card-title-styled">Customer Gender Breakdown</h3>
            <p className="card-subtitle-styled">Total gender ratio across customer entries</p>
          </div>
          <div className="chart-box">
            <svg width="180" height="180" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="8" />
              {/* Male 35.7% (length = 85.2, offset = 0) */}
              <circle cx="50" cy="50" r="38" fill="none" stroke="#3b82f6" strokeWidth="8"
                strokeDasharray="85.2 238.7" strokeDashoffset="0" className="donut-segment" />
              {/* Other 32.7% (length = 78.0, offset = -85.2) */}
              <circle cx="50" cy="50" r="38" fill="none" stroke="#8b5cf6" strokeWidth="8"
                strokeDasharray="78.0 238.7" strokeDashoffset="-85.2" className="donut-segment" />
              {/* Female 31.6% (length = 75.5, offset = -163.2) */}
              <circle cx="50" cy="50" r="38" fill="none" stroke="#ec4899" strokeWidth="8"
                strokeDasharray="75.5 238.7" strokeDashoffset="-163.2" className="donut-segment" />
            </svg>
            
            <div className="legend-container" style={{ flexDirection: 'column', alignItems: 'flex-start', paddingLeft: '2rem', marginTop: '1rem' }}>
              <div className="legend-item" style={{ fontSize: '0.85rem' }}>
                <span className="legend-dot" style={{ backgroundColor: '#3b82f6', width: '12px', height: '12px' }}></span>
                <strong>Male:</strong> 357 (35.7%)
              </div>
              <div className="legend-item" style={{ fontSize: '0.85rem', marginTop: '0.4rem' }}>
                <span className="legend-dot" style={{ backgroundColor: '#8b5cf6', width: '12px', height: '12px' }}></span>
                <strong>Other:</strong> 327 (32.7%)
              </div>
              <div className="legend-item" style={{ fontSize: '0.85rem', marginTop: '0.4rem' }}>
                <span className="legend-dot" style={{ backgroundColor: '#ec4899', width: '12px', height: '12px' }}></span>
                <strong>Female:</strong> 316 (31.6%)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Row 2: Segmentation by Spending Power & Segment Age Curve */}
      <div className="grid-2-col" style={{ marginBottom: '2rem' }}>
        
        {/* Stacked spending power chart */}
        <div className="card-styled">
          <div className="card-header-group">
            <h3 className="card-title-styled">Segmentation by Spending Power</h3>
            <p className="card-subtitle-styled">Comparison of customer spending profiles per target segment</p>
          </div>
          <div className="chart-box" style={{ justifyContent: 'flex-end', height: '100%' }}>
            <div className="vertical-bar-chart" style={{ height: '220px' }}>
              
              {/* Seg A */}
              <div className="v-bar-container" style={{ width: '22%' }}>
                <div style={{ display: 'flex', flexDirection: 'column-reverse', height: '85%', width: '32px' }}>
                  <div style={{ height: '34.1%', backgroundColor: '#f43f5e', borderRadius: '0 0 0 0' }}></div>
                  <div style={{ height: '29.1%', backgroundColor: '#f97316', borderRadius: '0 0 0 0' }}></div>
                  <div style={{ height: '36.8%', backgroundColor: '#10b981', borderRadius: '4px 4px 0 0' }}></div>
                </div>
                <span className="v-bar-label">Segment A</span>
              </div>
              
              {/* Seg B */}
              <div className="v-bar-container" style={{ width: '22%' }}>
                <div style={{ display: 'flex', flexDirection: 'column-reverse', height: '85%', width: '32px' }}>
                  <div style={{ height: '34.0%', backgroundColor: '#f43f5e', borderRadius: '0 0 0 0' }}></div>
                  <div style={{ height: '31.6%', backgroundColor: '#f97316', borderRadius: '0 0 0 0' }}></div>
                  <div style={{ height: '34.4%', backgroundColor: '#10b981', borderRadius: '4px 4px 0 0' }}></div>
                </div>
                <span className="v-bar-label">Segment B</span>
              </div>
              
              {/* Seg C */}
              <div className="v-bar-container" style={{ width: '22%' }}>
                <div style={{ display: 'flex', flexDirection: 'column-reverse', height: '0%', width: '32px' }}>
                  <div style={{ height: '0%', backgroundColor: '#f43f5e', borderRadius: '0 0 0 0' }}></div>
                  <div style={{ height: '0%', backgroundColor: '#f97316', borderRadius: '0 0 0 0' }}></div>
                  <div style={{ height: '0%', backgroundColor: '#10b981', borderRadius: '4px 4px 0 0' }}></div>
                </div>
                <span className="v-bar-label">Segment C</span>
              </div>
              
              {/* Seg D */}
              <div className="v-bar-container" style={{ width: '22%' }}>
                <div style={{ display: 'flex', flexDirection: 'column-reverse', height: '85%', width: '32px' }}>
                  <div style={{ height: '27.9%', backgroundColor: '#f43f5e', borderRadius: '0 0 0 0' }}></div>
                  <div style={{ height: '32.6%', backgroundColor: '#f97316', borderRadius: '0 0 0 0' }}></div>
                  <div style={{ height: '39.5%', backgroundColor: '#10b981', borderRadius: '4px 4px 0 0' }}></div>
                </div>
                <span className="v-bar-label">Segment D</span>
              </div>
            </div>
            
            <div className="legend-container" style={{ marginTop: '1rem' }}>
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: '#10b981' }}></span> High Spending
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: '#f97316' }}></span> Average Spending
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: '#f43f5e' }}></span> Low Spending
              </div>
            </div>
          </div>
        </div>
        
        {/* Line graph curve */}
        <div className="card-styled">
          <div className="card-header-group">
            <h3 className="card-title-styled">Segment Age Curve</h3>
            <p className="card-subtitle-styled">Detailed demographic curve showing age clusters</p>
          </div>
          <div className="chart-box">
            <svg width="100%" height="220" viewBox="0 0 300 150" preserveAspectRatio="none">
              <defs>
                <linearGradient id="ageCurveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.45"/>
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0"/>
                </linearGradient>
              </defs>
              
              {/* Grid lines */}
              <line x1="10" y1="20" x2="290" y2="20" stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3"/>
              <line x1="10" y1="75" x2="290" y2="75" stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3"/>
              <line x1="10" y1="130" x2="290" y2="130" stroke="rgba(255,255,255,0.05)"/>
              
              {/* Y Axis text */}
              <text x="10" y="16" fill="var(--text-dim)" fontSize="8">65</text>
              <text x="10" y="71" fill="var(--text-dim)" fontSize="8">48</text>
              <text x="10" y="126" fill="var(--text-dim)" fontSize="8">18</text>
              
              {/* Area fill */}
              <path d="M 30 82 C 70 82, 90 83, 110 83 C 130 83, 170 130, 190 130 C 210 130, 250 85, 270 85 L 270 130 L 30 130 Z" fill="url(#ageCurveGradient)"/>
              
              {/* Line curve path */}
              <path d="M 30 82 C 70 82, 90 83, 110 83 C 130 83, 170 130, 190 130 C 210 130, 250 85, 270 85" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round"/>
              
              {/* Points */}
              <circle cx="30" cy="82" r="3" fill="#6366f1" stroke="#fff" strokeWidth="1"/>
              <circle cx="110" cy="83" r="3" fill="#6366f1" stroke="#fff" strokeWidth="1"/>
              <circle cx="190" cy="130" r="3" fill="#6366f1" stroke="#fff" strokeWidth="1"/>
              <circle cx="270" cy="85" r="3" fill="#6366f1" stroke="#fff" strokeWidth="1"/>
              
              {/* X axis labels */}
              <text x="20" y="142" fill="var(--text-dim)" fontSize="8">Segment A</text>
              <text x="100" y="142" fill="var(--text-dim)" fontSize="8">Segment B</text>
              <text x="180" y="142" fill="var(--text-dim)" fontSize="8">Segment C</text>
              <text x="250" y="142" fill="var(--text-dim)" fontSize="8">Segment D</text>
            </svg>
          </div>
        </div>
      </div>

      {/* Row 3: Data Quality Check Section */}
      <div className="card-styled" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header-group">
          <h3 className="card-title-styled">Data Engineering Quality Check</h3>
          <p className="card-subtitle-styled">Report on empty or missing records across attributes</p>
        </div>
        
        <div className="quality-cards-grid">
          {qualityCheckData.map((attr, idx) => (
            <div key={idx} className="quality-card">
              <div className="quality-card-header">
                <span className="quality-card-title">{attr.name}</span>
                <span className={`quality-badge ${attr.status}`}>
                  {attr.percentage}
                </span>
              </div>
              <div className="quality-card-stat">{attr.count}</div>
              <div className="quality-progress-bar">
                <div 
                  className={`quality-progress-fill ${attr.status}`}
                  style={{ width: attr.status === 'clean' ? '100%' : '88%' }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
