import React from 'react';
import { RefreshCw, Brain } from 'lucide-react';

export default function PredictSegment({
  formData,
  loading,
  singleResult,
  classProbabilities,
  handleInputChange,
  handleSingleSubmit,
  segmentMetadata
}) {
  return (
    <div className="predict-grid">
      {/* Form Card */}
      <div className="card-styled">
        <div className="card-header-group">
          <h3 className="card-title-styled">Customer Details Form</h3>
          <p className="card-subtitle-styled">Input demographics to calculate their segmentation profile</p>
        </div>
        
        <form onSubmit={handleSingleSubmit} className="form-grid-styled">
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
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          {/* Ever Married */}
          <div className="form-group">
            <label htmlFor="ever_married">Ever Married</label>
            <select 
              id="ever_married" 
              name="ever_married" 
              className="select-styled"
              value={formData.ever_married}
              onChange={handleInputChange}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          
          {/* Age */}
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="age">Age ({formData.age})</label>
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
          
          {/* Graduated */}
          <div className="form-group">
            <label htmlFor="graduated">Graduated</label>
            <select 
              id="graduated" 
              name="graduated" 
              className="select-styled"
              value={formData.graduated}
              onChange={handleInputChange}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          
          {/* Profession */}
          <div className="form-group">
            <label htmlFor="profession">Profession</label>
            <select 
              id="profession" 
              name="profession" 
              className="select-styled"
              value={formData.profession}
              onChange={handleInputChange}
            >
              <option value="Artist">Artist</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Engineer">Engineer</option>
              <option value="Doctor">Doctor</option>
              <option value="Lawyer">Lawyer</option>
              <option value="Executive">Executive</option>
              <option value="Marketing">Marketing</option>
              <option value="Homemaker">Homemaker</option>
            </select>
          </div>
          
          {/* Spending Score */}
          <div className="form-group">
            <label htmlFor="spending_score">Spending Score</label>
            <select 
              id="spending_score" 
              name="spending_score" 
              className="select-styled"
              value={formData.spending_score}
              onChange={handleInputChange}
            >
              <option value="Low">Low</option>
              <option value="Average">Average</option>
              <option value="High">High</option>
            </select>
          </div>
          
          {/* Work Experience */}
          <div className="form-group">
            <label htmlFor="work_experience">Work Experience (Years)</label>
            <input 
              id="work_experience"
              name="work_experience"
              type="number"
              min="0"
              max="20"
              className="input-styled"
              value={formData.work_experience}
              onChange={handleInputChange}
            />
          </div>
          
          {/* Family Size */}
          <div className="form-group">
            <label htmlFor="family_size">Family Size</label>
            <input 
              id="family_size"
              name="family_size"
              type="number"
              min="1"
              max="15"
              className="input-styled"
              value={formData.family_size}
              onChange={handleInputChange}
            />
          </div>
          
          {/* Var 1 */}
          <div className="form-group">
            <label htmlFor="var_1">Var_1 (Categorical Tag)</label>
            <select 
              id="var_1" 
              name="var_1" 
              className="select-styled"
              value={formData.var_1}
              onChange={handleInputChange}
            >
              <option value="Cat_1">Cat_1</option>
              <option value="Cat_2">Cat_2</option>
              <option value="Cat_3">Cat_3</option>
              <option value="Cat_4">Cat_4</option>
              <option value="Cat_5">Cat_5</option>
              <option value="Cat_6">Cat_6</option>
              <option value="Cat_7">Cat_7</option>
            </select>
          </div>
          
          <div className="form-group full-width" style={{ gridColumn: '1 / -1' }}>
            <button 
              type="submit" 
              className="btn-submit-predict" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw className="spinner" size={16} /> Running Predictor...
                </>
              ) : (
                <>
                  💎 Run Segmentation Predictor
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      {/* Output Results Panel */}
      <div className="result-display-panel">
        <div className="result-glow"></div>
        
        {/* Default state */}
        {!singleResult && !loading && (
          <div style={{ color: 'var(--text-secondary)' }}>
            <span className="diamond-icon-glow">💎</span>
            <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.5rem' }}>Ready to Predict</h3>
            <p style={{ fontSize: '0.85rem', maxWidth: '280px', margin: '0 auto' }}>
              Fill in the customer specifications on the left and trigger the classifier to see analytics profile and targeted campaigns.
            </p>
          </div>
        )}
        
        {/* Processing state */}
        {loading && (
          <div style={{ color: 'var(--text-secondary)' }}>
            <div className="spinner" style={{ margin: '0 auto 1.5rem' }}></div>
            <h3>Running ML Pipeline...</h3>
            <p style={{ fontSize: '0.85rem' }}>Evaluating models & computing cluster distance...</p>
          </div>
        )}
        
        {/* Solved State */}
        {singleResult && !loading && (
          <>
            <span className="diamond-icon-glow" style={{ color: segmentMetadata[singleResult.segment].color }}>💎</span>
            <h2 className="result-segment-title">{segmentMetadata[singleResult.segment].name}</h2>
            <div className="result-segment-subtitle">{segmentMetadata[singleResult.segment].subtitle}</div>
            
            <div className="confidence-pill">
              <Brain size={12} /> Model Confidence: {singleResult.confidence}%
            </div>
            
            <p className="result-description">
              {segmentMetadata[singleResult.segment].description}
            </p>
            
            <h4 className="campaigns-heading">Targeted Marketing Campaigns</h4>
            <div className="campaigns-grid">
              {segmentMetadata[singleResult.segment].campaigns.map((camp, idx) => (
                <span key={idx} className="campaign-badge">{camp}</span>
              ))}
            </div>
            
            <h4 className="campaigns-heading" style={{ marginBottom: '1rem' }}>Class Probability Distribution</h4>
            <div className="prob-dist-list">
              {['A', 'B', 'C', 'D'].map(segKey => (
                <div key={segKey} className="prob-row">
                  <div className="prob-labels">
                    <span>Seg {segKey}</span>
                    <span>{classProbabilities[segKey]}%</span>
                  </div>
                  <div className="prob-track">
                    <div 
                      className="prob-fill" 
                      style={{ 
                        width: `${classProbabilities[segKey]}%`,
                        backgroundColor: segmentMetadata[segKey].color
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
