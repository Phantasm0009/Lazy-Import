import React, { useState, Suspense } from 'react'
import { UtilityDemo } from './components/UtilityDemo'

// Use React.lazy() for React components
const HeavyChart = React.lazy(() => import('./components/HeavyChart'))
const DataGrid = React.lazy(() => import('./components/DataGrid'))
const RichEditor = React.lazy(() => import('./components/RichEditor'))

function Dashboard() {
  const [activeComponents, setActiveComponents] = useState({
    chart: false,
    grid: false,
    editor: false
  })

  const [loadTimes, setLoadTimes] = useState({
    chart: 0,
    grid: 0,
    editor: 0
  })

  const handleShowComponent = (component: keyof typeof activeComponents) => {
    const start = performance.now()
    
    setActiveComponents(prev => ({
      ...prev,
      [component]: true
    }))

    setTimeout(() => {
      const end = performance.now()
      setLoadTimes(prev => ({
        ...prev,
        [component]: end - start
      }))
    }, 100)
  }

  const showAllComponents = () => {
    Object.keys(activeComponents).forEach(component => {
      handleShowComponent(component as keyof typeof activeComponents)
    })
  }

  const hideAllComponents = () => {
    setActiveComponents({
      chart: false,
      grid: false,
      editor: false
    })
  }

  return (
    <div className="dashboard">
      <h1>🚀 React + Lazy Loading Demo</h1>
      <p>This demo shows both React.lazy() for components and lazy-import concepts for utilities.</p>
      
      <div className="controls">
        <button 
          onClick={() => handleShowComponent('chart')}
          disabled={activeComponents.chart}
        >
          {activeComponents.chart ? 'Chart Loaded' : 'Load Chart'}
        </button>
        
        <button 
          onClick={() => handleShowComponent('grid')}
          disabled={activeComponents.grid}
        >
          {activeComponents.grid ? 'Grid Loaded' : 'Load Data Grid'}
        </button>
        
        <button 
          onClick={() => handleShowComponent('editor')}
          disabled={activeComponents.editor}
        >
          {activeComponents.editor ? 'Editor Loaded' : 'Load Editor'}
        </button>
        
        <button onClick={showAllComponents}>
          Load All
        </button>
        
        <button onClick={hideAllComponents}>
          Hide All
        </button>
      </div>

      <div className="stats">
        <div className="stat-card">
          <h4>Chart Component</h4>
          <p>{activeComponents.chart ? `✅ ${loadTimes.chart.toFixed(2)}ms` : '❌ Not loaded'}</p>
        </div>
        
        <div className="stat-card">
          <h4>Data Grid</h4>
          <p>{activeComponents.grid ? `✅ ${loadTimes.grid.toFixed(2)}ms` : '❌ Not loaded'}</p>
        </div>
        
        <div className="stat-card">
          <h4>Rich Editor</h4>
          <p>{activeComponents.editor ? `✅ ${loadTimes.editor.toFixed(2)}ms` : '❌ Not loaded'}</p>
        </div>
        
        <div className="stat-card">
          <h4>Total Loaded</h4>
          <p>{Object.values(activeComponents).filter(Boolean).length}/3</p>
        </div>
      </div>

      <UtilityDemo />

      <div className="content">
        <Suspense fallback={<div className="loading">Loading Chart Component...</div>}>
          {activeComponents.chart && <HeavyChart />}
        </Suspense>
        
        <Suspense fallback={<div className="loading">Loading Data Grid...</div>}>
          {activeComponents.grid && <DataGrid />}
        </Suspense>
        
        <Suspense fallback={<div className="loading">Loading Rich Editor...</div>}>
          {activeComponents.editor && <RichEditor />}
        </Suspense>
      </div>

      <div className="preload-demo">
        <h3>💡 Lazy Loading Approaches</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
          <div style={{ background: '#e8f4fd', padding: '16px', borderRadius: '8px' }}>
            <h4>🎯 React.lazy()</h4>
            <p><strong>Best for:</strong> React components</p>
            <ul style={{ textAlign: 'left', fontSize: '0.9em' }}>
              <li>Component-based code splitting</li>
              <li>Route-based lazy loading</li>
              <li>Feature-based splits</li>
              <li>Works with Suspense</li>
            </ul>
          </div>
          
          <div style={{ background: '#e8f5e8', padding: '16px', borderRadius: '8px' }}>
            <h4>🔧 lazy-import</h4>
            <p><strong>Best for:</strong> Node.js modules</p>
            <ul style={{ textAlign: 'left', fontSize: '0.9em' }}>
              <li>Server-side lazy loading</li>
              <li>CLI tools with optional deps</li>
              <li>Heavy utility libraries</li>
              <li>Conditional feature loading</li>
            </ul>
          </div>
        </div>
      </div>

      <div style={{
        background: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '6px',
        padding: '16px',
        margin: '16px 0'
      }}>
        <h4>📚 Real-world Usage:</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', textAlign: 'left' }}>
          <div>
            <h5>Frontend (React):</h5>
            <ul style={{ fontSize: '0.9em' }}>
              <li>Route components with React.lazy()</li>
              <li>Heavy charting libraries</li>
              <li>Rich text editors</li>
              <li>Admin panels</li>
            </ul>
          </div>
          <div>
            <h5>Backend (Node.js):</h5>
            <ul style={{ fontSize: '0.9em' }}>
              <li>Image processing with sharp</li>
              <li>PDF generation with puppeteer</li>
              <li>Email services</li>
              <li>Database migration tools</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div className="app">
      <Dashboard />
    </div>
  )
}