/**
 * React examples showing lazy-import usage in frontend applications
 */
import React, { useState, useCallback } from 'react';
import lazy from 'lazy-import';

// Lazy load heavy components
const loadChart = lazy('./components/HeavyChart');
const loadDataGrid = lazy('./components/DataGrid');
const loadRichEditor = lazy('./components/RichEditor');

// Hook for lazy loading with state management
function useLazyComponent<T>(loader: () => Promise<{ default: T }>) {
  const [Component, setComponent] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (Component) return Component;
    
    setLoading(true);
    setError(null);
    
    try {
      const module = await loader();
      setComponent(module.default);
      return module.default;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load component');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loader, Component]);

  return { Component, loading, error, load };
}

// Example component using lazy loading
export function Dashboard() {
  const chart = useLazyComponent(loadChart);
  const dataGrid = useLazyComponent(loadDataGrid);
  const editor = useLazyComponent(loadRichEditor);

  const handleShowChart = async () => {
    await chart.load();
  };

  const handleShowGrid = async () => {
    await dataGrid.load();
  };

  const handleShowEditor = async () => {
    await editor.load();
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <div className="controls">
        <button onClick={handleShowChart} disabled={chart.loading}>
          {chart.loading ? 'Loading Chart...' : 'Show Chart'}
        </button>
        
        <button onClick={handleShowGrid} disabled={dataGrid.loading}>
          {dataGrid.loading ? 'Loading Grid...' : 'Show Data Grid'}
        </button>
        
        <button onClick={handleShowEditor} disabled={editor.loading}>
          {editor.loading ? 'Loading Editor...' : 'Show Editor'}
        </button>
      </div>

      <div className="content">
        {chart.error && <div className="error">Chart Error: {chart.error}</div>}
        {chart.Component && <chart.Component data={chartData} />}
        
        {dataGrid.error && <div className="error">Grid Error: {dataGrid.error}</div>}
        {dataGrid.Component && <dataGrid.Component data={gridData} />}
        
        {editor.error && <div className="error">Editor Error: {editor.error}</div>}
        {editor.Component && <editor.Component content={editorContent} />}
      </div>
    </div>
  );
}

// Route-based lazy loading
const routes = {
  '/dashboard': lazy('./pages/Dashboard'),
  '/settings': lazy('./pages/Settings'),
  '/profile': lazy('./pages/Profile'),
  '/analytics': lazy('./pages/Analytics')
};

export function Router({ currentPath }: { currentPath: string }) {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const loadRoute = async () => {
      const routeLoader = routes[currentPath];
      if (!routeLoader) return;

      setLoading(true);
      try {
        const module = await routeLoader();
        setComponent(() => module.default);
      } catch (error) {
        console.error('Failed to load route:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRoute();
  }, [currentPath]);

  if (loading) {
    return <div className="loading">Loading page...</div>;
  }

  if (!Component) {
    return <div className="error">Page not found</div>;
  }

  return <Component />;
}

// Utility for preloading on hover
export function PreloadLink({ to, children, ...props }: { 
  to: string; 
  children: React.ReactNode;
  [key: string]: any;
}) {
  const handleMouseEnter = useCallback(() => {
    const routeLoader = routes[to];
    if (routeLoader) {
      // Preload on hover
      routeLoader().catch(console.error);
    }
  }, [to]);

  return (
    <a 
      {...props} 
      href={to} 
      onMouseEnter={handleMouseEnter}
    >
      {children}
    </a>
  );
}

// Mock data for examples
const chartData = [/* chart data */];
const gridData = [/* grid data */];
const editorContent = "Initial editor content";