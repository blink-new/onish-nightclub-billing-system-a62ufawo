import React, { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { LoginForm } from './components/LoginForm'
import { Layout } from './components/Layout'
import { Dashboard } from './components/Dashboard'
import { BillingInterface } from './components/BillingInterface'
import { Toaster } from './components/ui/toaster'
import './App.css'

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth()
  const [currentPage, setCurrentPage] = useState('dashboard')

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'billing':
        return <BillingInterface />
      case 'members':
        return (
          <div className="text-white">
            <h2 className="text-2xl font-bold mb-4">Members Management</h2>
            <p className="text-gray-400">Coming soon...</p>
          </div>
        )
      case 'add-member':
        return (
          <div className="text-white">
            <h2 className="text-2xl font-bold mb-4">Add New Member</h2>
            <p className="text-gray-400">Coming soon...</p>
          </div>
        )
      case 'reports':
        return (
          <div className="text-white">
            <h2 className="text-2xl font-bold mb-4">Reports & Analytics</h2>
            <p className="text-gray-400">Coming soon...</p>
          </div>
        )
      case 'staff':
        return (
          <div className="text-white">
            <h2 className="text-2xl font-bold mb-4">Staff Management</h2>
            <p className="text-gray-400">Coming soon...</p>
          </div>
        )
      case 'products':
        return (
          <div className="text-white">
            <h2 className="text-2xl font-bold mb-4">Product Management</h2>
            <p className="text-gray-400">Coming soon...</p>
          </div>
        )
      case 'shifts':
        return (
          <div className="text-white">
            <h2 className="text-2xl font-bold mb-4">Shift Management</h2>
            <p className="text-gray-400">Coming soon...</p>
          </div>
        )
      case 'transactions':
        return (
          <div className="text-white">
            <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
            <p className="text-gray-400">Coming soon...</p>
          </div>
        )
      case 'settings':
        return (
          <div className="text-white">
            <h2 className="text-2xl font-bold mb-4">System Settings</h2>
            <p className="text-gray-400">Coming soon...</p>
          </div>
        )
      default:
        return <Dashboard />
    }
  }

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  )
}

export default App