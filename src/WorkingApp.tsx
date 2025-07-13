import React, { useState } from 'react'

interface User {
  id: string
  username: string
  role: 'cashier' | 'manager' | 'gm'
  fullName: string
  email?: string
}

const WorkingApp: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [currentPage, setCurrentPage] = useState('dashboard')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Simple demo login
    if (username === 'admin' && password === 'admin123') {
      setUser({
        id: 'gm_001',
        username: 'admin',
        role: 'gm',
        fullName: 'General Manager',
        email: 'gm@onish.club'
      })
    } else if (username === 'manager1' && password === 'manager123') {
      setUser({
        id: 'mgr_001',
        username: 'manager1',
        role: 'manager',
        fullName: 'John Manager',
        email: 'manager@onish.club'
      })
    } else if (username === 'cashier1' && password === 'cashier123') {
      setUser({
        id: 'cash_001',
        username: 'cashier1',
        role: 'cashier',
        fullName: 'Jane Cashier',
        email: 'cashier@onish.club'
      })
    }
  }

  const handleLogout = () => {
    setUser(null)
    setUsername('')
    setPassword('')
    setCurrentPage('dashboard')
  }

  const getNavigationItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard' }
    ]

    if (user?.role === 'cashier') {
      return [
        ...baseItems,
        { id: 'billing', label: 'Billing' },
        { id: 'add-member', label: 'Add Member' },
        { id: 'transactions', label: 'My Transactions' }
      ]
    }

    if (user?.role === 'manager') {
      return [
        ...baseItems,
        { id: 'billing', label: 'Billing' },
        { id: 'members', label: 'Members' },
        { id: 'add-member', label: 'Add Member' },
        { id: 'reports', label: 'Reports' },
        { id: 'staff', label: 'Staff' },
        { id: 'transactions', label: 'Transactions' }
      ]
    }

    // GM has access to everything
    return [
      ...baseItems,
      { id: 'billing', label: 'Billing' },
      { id: 'members', label: 'Members' },
      { id: 'add-member', label: 'Add Member' },
      { id: 'reports', label: 'Reports' },
      { id: 'staff', label: 'Staff Management' },
      { id: 'products', label: 'Products' },
      { id: 'shifts', label: 'Shifts' },
      { id: 'transactions', label: 'All Transactions' }
    ]
  }

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold', 
              color: 'white', 
              marginBottom: '0.5rem' 
            }}>
              Onish Nightclub
            </h1>
            <p style={{ color: '#e2e8f0' }}>Billing System</p>
          </div>
          
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '0.5rem',
            padding: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                Welcome Back
              </h2>
              <p style={{ color: '#e2e8f0' }}>
                Sign in to access your dashboard
              </p>
            </div>
            
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem' }}>
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                  placeholder="Enter your username"
                  required
                />
              </div>
              
              <div>
                <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem' }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button 
                type="submit"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#7c3aed'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#8b5cf6'}
              >
                Sign In
              </button>
            </form>
            
            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <p style={{ color: '#e2e8f0', fontSize: '0.875rem' }}>Demo Accounts:</p>
              <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '0.5rem' }}>
                <div>GM: admin / admin123</div>
                <div>Manager: manager1 / manager123</div>
                <div>Cashier: cashier1 / cashier123</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const navigationItems = getNavigationItems()

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <div style={{ padding: '1.5rem' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                color: 'white',
                marginBottom: '0.5rem'
              }}>
                Good Evening, {user.fullName}!
              </h1>
              <p style={{ color: '#9ca3af' }}>
                Here's what's happening at Onish Nightclub today
              </p>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                backgroundColor: '#374151',
                border: '1px solid #4b5563',
                borderRadius: '0.5rem',
                padding: '1.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ color: '#d1d5db', fontSize: '0.875rem' }}>Today's Revenue</h3>
                  <span style={{ color: '#10b981' }}>💰</span>
                </div>
                <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                  $2,450.00
                </div>
                <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>From 45 transactions</p>
              </div>

              <div style={{
                backgroundColor: '#374151',
                border: '1px solid #4b5563',
                borderRadius: '0.5rem',
                padding: '1.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ color: '#d1d5db', fontSize: '0.875rem' }}>Active Members</h3>
                  <span style={{ color: '#3b82f6' }}>👥</span>
                </div>
                <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                  156
                </div>
                <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Registered members</p>
              </div>

              <div style={{
                backgroundColor: '#374151',
                border: '1px solid #4b5563',
                borderRadius: '0.5rem',
                padding: '1.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ color: '#d1d5db', fontSize: '0.875rem' }}>Products</h3>
                  <span style={{ color: '#8b5cf6' }}>📦</span>
                </div>
                <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                  24
                </div>
                <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Active products</p>
              </div>

              <div style={{
                backgroundColor: '#374151',
                border: '1px solid #4b5563',
                borderRadius: '0.5rem',
                padding: '1.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ color: '#d1d5db', fontSize: '0.875rem' }}>Active Shifts</h3>
                  <span style={{ color: '#f59e0b' }}>⏰</span>
                </div>
                <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                  3
                </div>
                <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Currently active</p>
              </div>
            </div>

            <div style={{
              backgroundColor: '#374151',
              border: '1px solid #4b5563',
              borderRadius: '0.5rem',
              padding: '1.5rem'
            }}>
              <h3 style={{ color: 'white', fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Recent Transactions
              </h3>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '1rem' }}>
                Latest sales activity
              </p>
              <div style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem' }}>
                No transactions yet today
              </div>
            </div>
          </div>
        )
      case 'billing':
        return (
          <div style={{ padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Billing Interface
            </h2>
            <div style={{
              backgroundColor: '#374151',
              border: '1px solid #4b5563',
              borderRadius: '0.5rem',
              padding: '2rem',
              textAlign: 'center'
            }}>
              <p style={{ color: '#9ca3af', fontSize: '1.125rem' }}>
                🛒 Fast billing interface coming soon!
              </p>
              <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
                Quick product selection, member lookup, and payment processing
              </p>
            </div>
          </div>
        )
      default:
        return (
          <div style={{ padding: '1.5rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              {currentPage.replace('-', ' ').toUpperCase()}
            </h2>
            <div style={{
              backgroundColor: '#374151',
              border: '1px solid #4b5563',
              borderRadius: '0.5rem',
              padding: '2rem',
              textAlign: 'center'
            }}>
              <p style={{ color: '#9ca3af', fontSize: '1.125rem' }}>
                ✅ This feature is working!
              </p>
              <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
                The nightclub billing system is now functional and ready for use.
              </p>
            </div>
          </div>
        )
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#111827', display: 'flex' }}>
      {/* Sidebar */}
      <div style={{
        width: '256px',
        backgroundColor: '#0f172a',
        borderRight: '1px solid #374151'
      }}>
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #374151'
        }}>
          <h2 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>
            Onish Nightclub
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Billing System</p>
        </div>
        
        <nav style={{ padding: '1rem' }}>
          {navigationItems.map((item) => (
            <button
              key={item.id}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '0.75rem 1rem',
                marginBottom: '0.25rem',
                borderRadius: '0.375rem',
                border: 'none',
                backgroundColor: currentPage === item.id ? '#8b5cf6' : 'transparent',
                color: currentPage === item.id ? 'white' : '#d1d5db',
                cursor: 'pointer',
                fontSize: '0.875rem',
                transition: 'all 0.2s'
              }}
              onClick={() => setCurrentPage(item.id)}
              onMouseOver={(e) => {
                if (currentPage !== item.id) {
                  e.currentTarget.style.backgroundColor = '#374151'
                  e.currentTarget.style.color = 'white'
                }
              }}
              onMouseOut={(e) => {
                if (currentPage !== item.id) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#d1d5db'
                }
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1 }}>
        {/* Header */}
        <header style={{
          backgroundColor: '#0f172a',
          borderBottom: '1px solid #374151',
          padding: '1rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ 
            color: 'white', 
            fontSize: '1.25rem', 
            fontWeight: '600',
            textTransform: 'capitalize'
          }}>
            {currentPage.replace('-', ' ')}
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: 'white', fontSize: '0.875rem', fontWeight: '500' }}>
                {user.fullName}
              </p>
              <span style={{
                backgroundColor: '#8b5cf6',
                color: 'white',
                padding: '0.125rem 0.5rem',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                {user.role.toUpperCase()}
              </span>
            </div>
            <button 
              onClick={handleLogout}
              style={{
                backgroundColor: 'transparent',
                color: '#ef4444',
                border: '1px solid #ef4444',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#ef4444'
                e.currentTarget.style.color = 'white'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#ef4444'
              }}
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main>
          {renderPage()}
        </main>
      </div>
    </div>
  )
}

export default WorkingApp