import React from 'react'

const DataGrid: React.FC = () => {
  const mockData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'Editor' },
  ]

  return (
    <div className="component-demo">
      <h3>📋 Data Grid Component</h3>
      <p>This simulates a complex data grid like AG-Grid</p>
      <div style={{ 
        background: '#f3e5f5', 
        borderRadius: 4, 
        padding: '16px',
        border: '2px solid #9c27b0'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #9c27b0' }}>
              <th style={{ padding: '8px', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Role</th>
            </tr>
          </thead>
          <tbody>
            {mockData.map(row => (
              <tr key={row.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '8px' }}>{row.id}</td>
                <td style={{ padding: '8px' }}>{row.name}</td>
                <td style={{ padding: '8px' }}>{row.email}</td>
                <td style={{ padding: '8px' }}>
                  <span style={{ 
                    background: '#e1f5fe', 
                    padding: '2px 8px', 
                    borderRadius: '12px',
                    fontSize: '0.8rem'
                  }}>
                    {row.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.8rem', color: '#666' }}>
          Data Grid loaded at: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}

export default DataGrid