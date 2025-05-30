import React, { useState } from 'react'
import { LazyUtilities } from '../utils/LazyUtilities'

export const UtilityDemo: React.FC = () => {
  const [results, setResults] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [cacheStats, setCacheStats] = useState({ size: 0, modules: [] as string[] })

  const updateCacheStats = () => {
    setCacheStats(LazyUtilities.getCacheStats())
  }

  const loadUtility = async (utilityName: string, demo: () => Promise<any>) => {
    setLoading(prev => ({ ...prev, [utilityName]: true }))
    
    try {
      const start = performance.now()
      const result = await demo()
      const end = performance.now()
      
      setResults(prev => ({
        ...prev,
        [utilityName]: {
          ...result,
          loadTime: `${(end - start).toFixed(2)}ms`
        }
      }))
      
      updateCacheStats()
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [utilityName]: { error: error instanceof Error ? error.message : 'Unknown error' }
      }))
    } finally {
      setLoading(prev => ({ ...prev, [utilityName]: false }))
    }
  }

  const demoLodash = async () => {
    const lodash = await LazyUtilities.loadUtility('lodash')
    
    const testFn = (msg: string) => console.log('Debounced:', msg)
    const debouncedFn = lodash.debounce(testFn, 300)
    
    const testObj = { a: 1, b: { c: 2 } }
    const cloned = lodash.cloneDeep(testObj)
    
    return {
      message: 'Lodash utilities loaded successfully',
      debouncedFunction: 'Created debounced function with 300ms delay',
      cloneDeep: `Original: ${JSON.stringify(testObj)}, Cloned: ${JSON.stringify(cloned)}`,
      functionsAvailable: Object.keys(lodash)
    }
  }

  const demoDateFns = async () => {
    const dateFns = await LazyUtilities.loadUtility('date-fns')
    
    const now = new Date()
    const future = dateFns.addDays(now, 7)
    const formatted = dateFns.format(now, 'yyyy-MM-dd')
    const daysDiff = dateFns.differenceInDays(future, now)
    
    return {
      message: 'Date-fns utilities loaded successfully',
      currentDate: formatted,
      futureDate: dateFns.format(future, 'yyyy-MM-dd'),
      daysDifference: `${daysDiff} days`,
      functionsAvailable: Object.keys(dateFns)
    }
  }

  const demoValidator = async () => {
    const validator = await LazyUtilities.loadUtility('validator')
    
    const testEmail = 'test@example.com'
    const testURL = 'https://example.com'
    const testNumber = '12345'
    
    return {
      message: 'Validator utilities loaded successfully',
      emailValidation: `${testEmail} is ${validator.isEmail(testEmail) ? 'valid' : 'invalid'}`,
      urlValidation: `${testURL} is ${validator.isURL(testURL) ? 'valid' : 'invalid'}`,
      numberValidation: `${testNumber} is ${validator.isNumeric(testNumber) ? 'numeric' : 'not numeric'}`,
      functionsAvailable: Object.keys(validator)
    }
  }

  const clearCache = () => {
    LazyUtilities.clearCache()
    setResults({})
    updateCacheStats()
  }

  return (
    <div style={{ 
      background: '#f8f9fa', 
      padding: '16px', 
      borderRadius: '8px',
      border: '1px solid #dee2e6',
      margin: '16px 0'
    }}>
      <h3>🔧 Utility Libraries Demo</h3>
      <p>This demonstrates lazy loading of utility libraries (simulated for the browser environment).</p>
      
      <div style={{ marginBottom: '16px' }}>
        <strong>Cache Status:</strong> {cacheStats.size} modules cached
        {cacheStats.modules.length > 0 && (
          <span> ({cacheStats.modules.join(', ')})</span>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        <button 
          onClick={() => loadUtility('lodash', demoLodash)}
          disabled={loading.lodash}
          style={{
            padding: '8px 16px',
            background: loading.lodash ? '#ccc' : '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading.lodash ? 'not-allowed' : 'pointer'
          }}
        >
          {loading.lodash ? 'Loading...' : 'Load Lodash'}
        </button>

        <button 
          onClick={() => loadUtility('date-fns', demoDateFns)}
          disabled={loading['date-fns']}
          style={{
            padding: '8px 16px',
            background: loading['date-fns'] ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading['date-fns'] ? 'not-allowed' : 'pointer'
          }}
        >
          {loading['date-fns'] ? 'Loading...' : 'Load Date-fns'}
        </button>

        <button 
          onClick={() => loadUtility('validator', demoValidator)}
          disabled={loading.validator}
          style={{
            padding: '8px 16px',
            background: loading.validator ? '#ccc' : '#ffc107',
            color: 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: loading.validator ? 'not-allowed' : 'pointer'
          }}
        >
          {loading.validator ? 'Loading...' : 'Load Validator'}
        </button>

        <button 
          onClick={clearCache}
          style={{
            padding: '8px 16px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Clear Cache
        </button>
      </div>

      {Object.entries(results).map(([utilityName, result]) => (
        <div 
          key={utilityName}
          style={{
            background: 'white',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '8px',
            border: '1px solid #dee2e6'
          }}
        >
          <h4 style={{ margin: '0 0 8px 0', color: '#495057' }}>
            {utilityName} {result.loadTime && <span style={{ fontSize: '0.8em', color: '#6c757d' }}>({result.loadTime})</span>}
          </h4>
          
          {result.error ? (
            <div style={{ color: 'red' }}>Error: {result.error}</div>
          ) : (
            <div style={{ fontSize: '0.9em', color: '#495057' }}>
              {Object.entries(result).map(([key, value]) => (
                key !== 'loadTime' && (
                  <div key={key} style={{ marginBottom: '4px' }}>
                    <strong>{key}:</strong> {String(value)}
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}