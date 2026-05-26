import React from 'react';
import { Database, Activity, Calendar, Briefcase, Award, Sparkles, TrendingUp, Users } from 'lucide-react';

export default function Dashboard() {
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

  return (
    <div>
      {/* 4 Cards Grid */}
      <div className="metrics-grid-4">
        {/* Card 1 */}
        <div className="metric-card-styled" style={{ '--accent-gradient': 'linear-gradient(to right, #8b5cf6, #3b82f6)' }}>
          <div className="metric-icon-wrapper" style={{ backgroundColor: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
            <Database size={18} />
          </div>
          <div className="metric-value-large">700</div>
          <div className="metric-label-small">Training Customers</div>
          <div className="metric-trend" style={{ color: 'var(--accent-teal)' }}>
            ↑ 70% training split
          </div>
        </div>
        
        {/* Card 2 */}
        <div className="metric-card-styled" style={{ '--accent-gradient': 'linear-gradient(to right, #10b981, #06b6d4)' }}>
          <div className="metric-icon-wrapper" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <Activity size={18} />
          </div>
          <div className="metric-value-large">300</div>
          <div className="metric-label-small">Test Samples</div>
          <div className="metric-trend" style={{ color: 'var(--accent-blue)' }}>
            <Info size={12} /> 30% validation ready
          </div>
        </div>
        
        {/* Card 3 */}
        <div className="metric-card-styled" style={{ '--accent-gradient': 'linear-gradient(to right, #f97316, #facc15)' }}>
          <div className="metric-icon-wrapper" style={{ backgroundColor: 'rgba(249, 115, 22, 0.15)', color: '#f97316' }}>
            <Calendar size={18} />
          </div>
          <div className="metric-value-large">43.8</div>
          <div className="metric-label-small">Average Customer Age</div>
          <div className="metric-trend" style={{ color: 'var(--text-secondary)' }}>
            Range: 18 - 69 years
          </div>
        </div>
        
        {/* Card 4 */}
        <div className="metric-card-styled" style={{ '--accent-gradient': 'linear-gradient(to right, #ec4899, #f43f5e)' }}>
          <div className="metric-icon-wrapper" style={{ backgroundColor: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' }}>
            <TrendingUp size={18} />
          </div>
          <div className="metric-value-large">Electronics</div>
          <div className="metric-label-small">Top Category</div>
          <div className="metric-trend" style={{ color: 'var(--accent-orange)' }}>
            ⚡ Popular segment
          </div>
        </div>
      </div>

      {/* 2-Column charts row */}
      <div className="grid-2-col">
        {/* Donut Chart */}
        <div className="card-styled">
          <div className="card-header-group">
            <h3 className="card-title-styled">Customer Segments Distribution</h3>
            <p className="card-subtitle-styled">Breakdown of customer database into target archetypes</p>
          </div>
          <div className="chart-box">
            <svg width="220" height="220" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="12" />
              
              {/* Seg A (74.5%) - length = 234.0, offset = 0 */}
              <circle cx="60" cy="60" r="50" fill="none" stroke="#8b5cf6" strokeWidth="12"
                strokeDasharray="234.0 314" strokeDashoffset="0" className="donut-segment" />
              
              {/* Seg B (21.2%) - length = 66.5, offset = -234.0 */}
              <circle cx="60" cy="60" r="50" fill="none" stroke="#10b981" strokeWidth="12"
                strokeDasharray="66.5 314" strokeDashoffset="-234.0" className="donut-segment" />
              
              {/* Seg C (0.0%) - length = 0, offset = -300.5 */}
              <circle cx="60" cy="60" r="50" fill="none" stroke="#f97316" strokeWidth="12"
                strokeDasharray="0 314" strokeDashoffset="-300.5" className="donut-segment" />
              
              {/* Seg D (4.3%) - length = 13.5, offset = -300.5 */}
              <circle cx="60" cy="60" r="50" fill="none" stroke="#f43f5e" strokeWidth="12"
                strokeDasharray="13.5 314" strokeDashoffset="-300.5" className="donut-segment" />
            </svg>
            
            <div className="legend-container">
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: '#8b5cf6' }}></span>
                Segment A (Premium High-Value) - 745 (74.5%)
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: '#10b981' }}></span>
                Segment B (Stable Mid-Range) - 212 (21.2%)
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: '#f97316' }}></span>
                Segment C (Moderate Spenders) - 0 (0.0%)
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: '#f43f5e' }}></span>
                Segment D (Budget Conscious) - 43 (4.3%)
              </div>
            </div>
          </div>
        </div>
        
        {/* Demographics Bar Chart */}
        <div className="card-styled">
          <div className="card-header-group">
            <h3 className="card-title-styled">Demographics: Age by Segment</h3>
            <p className="card-subtitle-styled">Average customer age across distinct segment profiles</p>
          </div>
          <div className="chart-box" style={{ justifyContent: 'flex-end', height: '100%' }}>
            <div className="vertical-bar-chart">
              <div className="v-bar-container">
                <div className="v-bar" style={{ height: '54.9%', backgroundImage: 'linear-gradient(to top, #8b5cf6, #c084fc)' }}>
                  <span className="bar-tooltip">43.9 yrs</span>
                </div>
                <span className="v-bar-label">Seg A</span>
              </div>
              <div className="v-bar-container">
                <div className="v-bar" style={{ height: '54.5%', backgroundImage: 'linear-gradient(to top, #10b981, #34d399)' }}>
                  <span className="bar-tooltip">43.6 yrs</span>
                </div>
                <span className="v-bar-label">Seg B</span>
              </div>
              <div className="v-bar-container">
                <div className="v-bar" style={{ height: '0%', backgroundImage: 'linear-gradient(to top, #f97316, #fb923c)' }}>
                  <span className="bar-tooltip">N/A</span>
                </div>
                <span className="v-bar-label">Seg C</span>
              </div>
              <div className="v-bar-container">
                <div className="v-bar" style={{ height: '53.8%', backgroundImage: 'linear-gradient(to top, #f43f5e, #fb7185)' }}>
                  <span className="bar-tooltip">43.0 yrs</span>
                </div>
                <span className="v-bar-label">Seg D</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Segment Profiles & Recommendations */}
      <h3 className="profiles-title">Customer Segment Profiles & Recommendations</h3>
      <div className="profiles-grid">
        {Object.entries(segmentMetadata).map(([key, segment]) => (
          <div key={key} className="profile-card" style={{ '--profile-color': segment.color }}>
            <div className="profile-card-header">
              <div className="profile-badge-pill" style={{ backgroundColor: segment.color }}>
                {key === 'A' ? '💎' : key === 'B' ? '🏠' : key === 'C' ? '💳' : '💰'} {segment.name}
              </div>
              <span className="profile-subtext">{segment.subtitle}</span>
            </div>
            
            <p className="profile-description">{segment.description}</p>
            
            <div>
              <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.65rem', fontWeight: 600, letterSpacing: '0.5px' }}>
                Actionable Marketing Campaigns
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {segment.campaigns.map((camp, idx) => (
                  <span key={idx} className="campaign-tag">{camp}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
