import React from 'react'

const HeavyChart: React.FC = () => {
  return (
    <div className="component-demo">
      <h3>📊 Heavy Chart Component</h3>
      <p>This simulates a heavy charting library like Chart.js or D3</p>
      <div style={{ 
        height: 200, 
        background: '#e3f2fd', 
        borderRadius: 4, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        border: '2px solid #2196f3'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📈</div>
          <span>Chart Component Loaded!</span>
          <div style={{ fontSize: '0.8rem', marginTop: '8px', color: '#666' }}>
            Timestamp: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeavyChart