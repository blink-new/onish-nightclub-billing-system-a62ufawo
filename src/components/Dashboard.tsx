import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { blink } from '../blink/client'
import {
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
  Clock,
  Package,
  AlertTriangle
} from 'lucide-react'

interface DashboardStats {
  todayRevenue: number
  totalMembers: number
  todayTransactions: number
  activeProducts: number
  lowStockItems: number
  activeShifts: number
}

export const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    todayRevenue: 0,
    totalMembers: 0,
    todayTransactions: 0,
    activeProducts: 0,
    lowStockItems: 0,
    activeShifts: 0
  })
  const [recentTransactions, setRecentTransactions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [user])

  const loadDashboardData = async () => {
    try {
      setError(null)
      const today = new Date().toISOString().split('T')[0]
      
      // Get today's transactions
      const todayTransactions = await blink.db.transactions.list({
        where: { shift_date: today },
        orderBy: { created_at: 'desc' }
      })

      // Calculate today's revenue
      const todayRevenue = todayTransactions.reduce((sum, t) => sum + parseFloat(t.total_amount), 0)

      // Get total members
      const members = await blink.db.members.list({
        where: { status: 'active' }
      })

      // Get products
      const products = await blink.db.products.list({
        where: { is_active: "1" }
      })

      // Get low stock items
      const lowStockItems = products.filter(p => p.stock_quantity <= p.low_stock_alert)

      // Get active shifts
      const activeShifts = await blink.db.shifts.list({
        where: { status: 'active' }
      })

      setStats({
        todayRevenue,
        totalMembers: members.length,
        todayTransactions: todayTransactions.length,
        activeProducts: products.length,
        lowStockItems: lowStockItems.length,
        activeShifts: activeShifts.length
      })

      // Get recent transactions for display
      const recent = user?.role === 'cashier' 
        ? todayTransactions.filter(t => t.cashier_id === user.id).slice(0, 5)
        : todayTransactions.slice(0, 5)
      
      setRecentTransactions(recent)
      
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setError('Failed to load dashboard data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={loadDashboardData}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          {getGreeting()}, {user?.fullName}!
        </h1>
        <p className="text-gray-400 mt-1">
          Here's what's happening at Onish Nightclub today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Today's Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {formatCurrency(stats.todayRevenue)}
            </div>
            <p className="text-xs text-gray-400">
              From {stats.todayTransactions} transactions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Active Members
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.totalMembers}
            </div>
            <p className="text-xs text-gray-400">
              Registered members
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              Products
            </CardTitle>
            <Package className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.activeProducts}
            </div>
            <p className="text-xs text-gray-400">
              Active products
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              {user?.role === 'cashier' ? 'Active Shifts' : 'Low Stock Alerts'}
            </CardTitle>
            {user?.role === 'cashier' ? (
              <Clock className="h-4 w-4 text-orange-500" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {user?.role === 'cashier' ? stats.activeShifts : stats.lowStockItems}
            </div>
            <p className="text-xs text-gray-400">
              {user?.role === 'cashier' ? 'Currently active' : 'Need restocking'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">
            {user?.role === 'cashier' ? 'My Recent Transactions' : 'Recent Transactions'}
          </CardTitle>
          <CardDescription className="text-gray-400">
            Latest sales activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentTransactions.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No transactions yet today
            </p>
          ) : (
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-purple-600 p-2 rounded-full">
                      <ShoppingCart className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        Transaction #{transaction.transaction_number}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {new Date(transaction.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">
                      {formatCurrency(parseFloat(transaction.total_amount))}
                    </p>
                    <Badge 
                      variant="secondary" 
                      className="bg-green-600 text-white text-xs"
                    >
                      {transaction.payment_method}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Low Stock Alert for Managers/GM */}
      {(user?.role === 'manager' || user?.role === 'gm') && stats.lowStockItems > 0 && (
        <Card className="bg-red-900/20 border-red-500/50">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Low Stock Alert
            </CardTitle>
            <CardDescription className="text-red-300">
              {stats.lowStockItems} products need restocking
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}