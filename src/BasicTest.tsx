import React from 'react'

const BasicTest: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#1f2937', 
      color: 'white', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      flexDirection: 'column'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        Onish Nightclub Billing System
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#9ca3af' }}>
        Basic React Test - Working!
      </p>
      <button 
        style={{
          marginTop: '2rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#8b5cf6',
          color: 'white',
          border: 'none',
          borderRadius: '0.375rem',
          cursor: 'pointer'
        }}
        onClick={() => alert('Button clicked!')}
      >
        Test Button
      </button>
    </div>
  )
}

export default BasicTest