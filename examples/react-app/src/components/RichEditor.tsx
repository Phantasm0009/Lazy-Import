import React, { useState } from 'react'

const RichEditor: React.FC = () => {
  const [content, setContent] = useState('Start typing here...')
  const [bold, setBold] = useState(false)
  const [italic, setItalic] = useState(false)

  return (
    <div className="component-demo">
      <h3>✏️ Rich Text Editor</h3>
      <p>This simulates a rich text editor like TinyMCE or Quill</p>
      <div style={{ 
        background: '#e8f5e8', 
        borderRadius: 4, 
        padding: '16px',
        border: '2px solid #4caf50'
      }}>
        <div style={{ marginBottom: '12px' }}>
          <button 
            onClick={() => setBold(!bold)}
            style={{ 
              marginRight: '8px', 
              padding: '4px 8px',
              background: bold ? '#4caf50' : '#f0f0f0',
              color: bold ? 'white' : 'black',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            <strong>B</strong>
          </button>
          <button 
            onClick={() => setItalic(!italic)}
            style={{ 
              marginRight: '8px', 
              padding: '4px 8px',
              background: italic ? '#4caf50' : '#f0f0f0',
              color: italic ? 'white' : 'black',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            <em>I</em>
          </button>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{
            width: '100%',
            height: '100px',
            padding: '12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontFamily: 'inherit',
            fontSize: '14px',
            fontWeight: bold ? 'bold' : 'normal',
            fontStyle: italic ? 'italic' : 'normal',
            resize: 'vertical'
          }}
        />
        <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.8rem', color: '#666' }}>
          Rich Editor loaded at: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}

export default RichEditor