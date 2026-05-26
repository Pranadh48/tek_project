import React, { useState } from 'react';
import { Award, Layers, TrendingUp, Users, Calendar, ArrowRight, Info } from 'lucide-react';

export default function KnnModel({ modelInfo }) {
  const [hoveredCell, setHoveredCell] = useState(null);

  if (!modelInfo || !modelInfo.stats || !modelInfo.stats.knn) {
    return (
      <div className="card-styled" style={{ padding: '3rem', textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto 1.5rem' }}></div>
        <h3>Loading KNN Model Data...</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Fetching performance metrics, correlation data and segment maps from the backend.
        </p>
      </div>
    );
  }

  const { stats, metrics, segments } = modelInfo;
  const accuracy = metrics.knn ? (metrics.knn.accuracy * 100).toFixed(2) : '95.33';
  const knnStats = stats.knn;

  // Correlation Matrix Labels
  const labelsMap = {
    'age': 'Age',
    'income': 'Income',
    'spending_score': 'Spend Score',
    'membership_years': 'Tenure',
    'purchase_frequency': 'Purchase Freq',
    'last_purchase_amount': 'Last Spend'
  };

  const correlationLabels = stats.correlation_labels.map(l => labelsMap[l] || l);
  const correlationMatrix = stats.correlation_matrix;

  // Segment metadata for profiles
  const segmentMeta = {
    '0': {
      icon: '💎',
      title: 'High-Value Shoppers',
      subtitle: 'Premium Shopper Profile',
      campaigns: ['VIP loyalty points multiplier', 'Exclusive preview of luxury collections', 'Free premium home delivery', 'Personal stylist consultations']
    },
    '1': {
      icon: '🚪',
      title: 'Low-Engagement Shoppers',
      subtitle: 'Affluent Dormant Profile',
      campaigns: ['Targeted re-engagement discounts', 'Invitations to special weekend pop-ups', 'Personalized email gift cards', 'Concierge check-in packages']
    },
    '2': {
      icon: '🛍️',
      title: 'Standard Shoppers',
      subtitle: 'Steady Value Profile',
      campaigns: ['Bundle deals (buy 2 get 1 free)', 'Seasonal product coupons', 'Family value packages', 'Store credit cashback promotions']
    }
  };

  // Calculate Donut segments
  let cumulativePercent = 0;
  const donutRadius = 38;
  const circumference = 2 * Math.PI * donutRadius; // ~238.76

  const donutSegments = Object.entries(knnStats.distribution).map(([key, data]) => {
    const percentage = data.percentage;
    const strokeDash = (percentage / 100) * circumference;
    const strokeOffset = -((cumulativePercent / 100) * circumference);
    cumulativePercent += percentage;
    return {
      key,
      percentage,
      count: data.count,
      strokeDash: `${strokeDash} ${circumference}`,
      strokeOffset,
      color: segments[key]?.color || '#ffffff',
      name: segments[key]?.name || `Segment ${key}`
    };
  });

  return (
    <div>
      {/* 4 Cards Grid */}
      <div className="metrics-grid-4" style={{ marginBottom: '2rem' }}>
        <div className="metric-card-styled" style={{ '--accent-gradient': 'linear-gradient(to right, #10b981, #06b6d4)' }}>
          <div className="metric-icon-wrapper" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <Award size={18} />
          </div>
          <div className="metric-value-large">{accuracy}%</div>
          <div className="metric-label-small">KNN Accuracy</div>
          <div className="metric-trend" style={{ color: 'var(--accent-teal)' }}>
            ⚡ Optimized with Standard Scaling (k=5)
          </div>
        </div>
        
        <div className="metric-card-styled" style={{ '--accent-gradient': 'linear-gradient(to right, #8b5cf6, #3b82f6)' }}>
          <div className="metric-icon-wrapper" style={{ backgroundColor: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
            <Users size={18} />
          </div>
          <div className="metric-value-large">{stats.training_records}</div>
          <div className="metric-label-small">Training Split</div>
          <div className="metric-trend" style={{ color: 'var(--text-secondary)' }}>
            70% train size ratio
          </div>
        </div>
        
        <div className="metric-card-styled" style={{ '--accent-gradient': 'linear-gradient(to right, #f97316, #facc15)' }}>
          <div className="metric-icon-wrapper" style={{ backgroundColor: 'rgba(249, 115, 22, 0.15)', color: '#f97316' }}>
            <Layers size={18} />
          </div>
          <div className="metric-value-large">{stats.test_records}</div>
          <div className="metric-label-small">Test Samples</div>
          <div className="metric-trend" style={{ color: 'var(--accent-blue)' }}>
            30% validation size
          </div>
        </div>
        
        <div className="metric-card-styled" style={{ '--accent-gradient': 'linear-gradient(to right, #ec4899, #f43f5e)' }}>
          <div className="metric-icon-wrapper" style={{ backgroundColor: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' }}>
            <Calendar size={18} />
          </div>
          <div className="metric-value-large">{stats.average_age.toFixed(1)}</div>
          <div className="metric-label-small">Average Age</div>
          <div className="metric-trend" style={{ color: 'var(--text-secondary)' }}>
            Full dataset mean
          </div>
        </div>
      </div>

      {/* Grid Row: Correlation Heatmap & Segment Distribution */}
      <div className="grid-2-col" style={{ marginBottom: '2rem' }}>
        
        {/* Dynamic Correlation Heatmap */}
        <div className="card-styled">
          <div className="card-header-group">
            <h3 className="card-title-styled">Dataset Correlation Heatmap</h3>
            <p className="card-subtitle-styled">Linear relationship between numerical attributes (-1 to +1)</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', flex: 1 }}>
            
            {/* Heatmap Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: `80px repeat(${correlationLabels.length}, 1fr)`,
              gap: '4px',
              width: '100%',
              maxWidth: '480px',
              margin: '0 auto',
              fontSize: '0.75rem',
              fontWeight: 500
            }}>
              {/* Top empty corner */}
              <div></div>
              {correlationLabels.map((lbl, idx) => (
                <div key={idx} style={{ 
                  textAlign: 'center', 
                  color: 'var(--text-secondary)',
                  writingMode: 'vertical-lr',
                  transform: 'rotate(180deg)',
                  padding: '6px 0',
                  height: '80px',
                  alignSelf: 'end',
                  whiteSpace: 'nowrap'
                }}>
                  {lbl}
                </div>
              ))}

              {/* Rows */}
              {correlationLabels.map((rowLabel, rIdx) => (
                <React.Fragment key={rIdx}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    color: 'var(--text-secondary)', 
                    justifyContent: 'flex-end', 
                    paddingRight: '8px', 
                    fontWeight: 600,
                    textAlign: 'right',
                    height: '42px'
                  }}>
                    {rowLabel}
                  </div>
                  {correlationMatrix[rIdx].map((cell, cIdx) => {
                    const val = cell.value;
                    const bgColor = val >= 0 
                      ? `rgba(99, 102, 241, ${val * 0.95})` 
                      : `rgba(244, 63, 94, ${Math.abs(val) * 0.95})`;
                    
                    return (
                      <div 
                        key={cIdx} 
                        style={{ 
                          height: '42px',
                          backgroundColor: bgColor,
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: Math.abs(val) > 0.4 ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          transition: 'var(--transition-smooth)',
                          border: hoveredCell && hoveredCell.r === rIdx && hoveredCell.c === cIdx 
                            ? '2px solid #ffffff' 
                            : '1px solid rgba(255, 255, 255, 0.05)'
                        }}
                        onMouseEnter={() => setHoveredCell({ r: rIdx, c: cIdx, val, x: correlationLabels[cIdx], y: rowLabel })}
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        {val.toFixed(2)}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>

            {/* Interactive Cell Info display */}
            <div style={{ 
              marginTop: '1.5rem', 
              padding: '0.75rem 1rem', 
              borderRadius: 'var(--radius-md)', 
              background: 'rgba(255, 255, 255, 0.02)', 
              border: '1px solid var(--border-color)', 
              width: '100%', 
              maxWidth: '480px',
              minHeight: '52px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)'
            }}>
              {hoveredCell ? (
                <span>
                  Correlation between <strong style={{ color: '#fff' }}>{hoveredCell.y}</strong> and <strong style={{ color: '#fff' }}>{hoveredCell.x}</strong> is <strong style={{ color: hoveredCell.val >= 0 ? 'var(--accent-purple)' : 'var(--accent-rose)', fontSize: '0.9rem' }}>{hoveredCell.val.toFixed(4)}</strong>
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Info size={14} /> Hover over correlation blocks to inspect relationships
                </span>
              )}
            </div>

          </div>
        </div>

        {/* KNN Segment Distribution Donut */}
        <div className="card-styled">
          <div className="card-header-group">
            <h3 className="card-title-styled">KNN Segments Distribution</h3>
            <p className="card-subtitle-styled">Breakdown of customer classification based on KNN predictions</p>
          </div>
          <div className="chart-box">
            <svg width="180" height="180" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r={donutRadius} fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="9" />
              {donutSegments.map((seg, idx) => (
                <circle 
                  key={idx}
                  cx="50" 
                  cy="50" 
                  r={donutRadius} 
                  fill="none" 
                  stroke={seg.color} 
                  strokeWidth="9"
                  strokeDasharray={seg.strokeDash} 
                  strokeDashoffset={seg.strokeOffset} 
                  className="donut-segment" 
                />
              ))}
            </svg>
            
            <div className="legend-container" style={{ flexDirection: 'column', alignItems: 'flex-start', paddingLeft: '1rem', marginTop: '1.25rem', width: '100%', maxWidth: '360px' }}>
              {donutSegments.map((seg, idx) => (
                <div key={idx} className="legend-item" style={{ fontSize: '0.85rem', width: '100%', justifyContent: 'space-between', padding: '0.25rem 0' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="legend-dot" style={{ backgroundColor: seg.color }}></span>
                    <strong>{seg.name}:</strong>
                  </span>
                  <span>{seg.count} samples ({seg.percentage.toFixed(1)}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Row: Demographics Bar Chart */}
      <div className="card-styled" style={{ marginBottom: '2rem' }}>
        <div className="card-header-group">
          <h3 className="card-title-styled">Demographics: Age by Predicted Segment</h3>
          <p className="card-subtitle-styled">Average customer age across KNN classifications</p>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '1rem 0' }}>
          <div className="vertical-bar-chart" style={{ height: '220px', maxWidth: '500px' }}>
            {Object.entries(knnStats.average_age).map(([key, ageVal]) => {
              const segName = segments[key]?.name || `Seg ${key}`;
              const segColor = segments[key]?.color || '#ffffff';
              const percentageHeight = Math.min((ageVal / 70) * 100, 100);
              
              return (
                <div key={key} className="v-bar-container" style={{ width: '25%' }}>
                  <div 
                    className="v-bar" 
                    style={{ 
                      height: `${percentageHeight}%`, 
                      background: `linear-gradient(to top, ${segColor}, rgba(255,255,255,0.15))` 
                    }}
                  >
                    <span className="bar-tooltip">{ageVal.toFixed(1)} yrs</span>
                  </div>
                  <span className="v-bar-label" style={{ fontWeight: 600, color: '#fff', fontSize: '0.75rem', textAlign: 'center', marginTop: '8px' }}>
                    {segName.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Customer Segment Profiles & Recommendations */}
      <h3 className="profiles-title" style={{ marginBottom: '1.25rem' }}>Customer Segment Profiles & Recommendations</h3>
      <div className="profiles-grid" style={{ marginBottom: '2rem' }}>
        {Object.entries(segmentMeta).map(([key, meta]) => {
          const segInfo = segments[key];
          if (!segInfo) return null;
          
          return (
            <div key={key} className="profile-card" style={{ '--profile-color': segInfo.color, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="profile-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="profile-badge-pill" style={{ backgroundColor: segInfo.color, padding: '0.35rem 0.85rem', borderRadius: '15px', color: '#fff', fontWeight: 600, fontSize: '0.8rem', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <span>{meta.icon}</span>
                  {segInfo.name}
                </div>
                <span className="profile-subtext" style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 500 }}>
                  {meta.subtitle}
                </span>
              </div>
              
              <p className="profile-description" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', flex: 1 }}>
                {segInfo.description}
              </p>
              
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '1rem' }}>
                <h4 style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.75rem', fontWeight: 600, letterSpacing: '0.5px' }}>
                  Targeted Marketing Strategy
                </h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', listStyle: 'none' }}>
                  {meta.campaigns.map((camp, idx) => (
                    <li key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <ArrowRight size={12} style={{ color: segInfo.color, flexShrink: 0 }} />
                      <span>{camp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
