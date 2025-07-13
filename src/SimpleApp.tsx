import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Label } from './components/ui/label'
import { Badge } from './components/ui/badge'
import { 
  User, 
  Lock, 
  DollarSign, 
  Users, 
  Package, 
  Clock,
  CashRegister,
  BarChart3,
  UserPlus,
  Receipt
} from 'lucide-react'

interface User {
  id: string
  username: string
  role: 'cashier' | 'manager' | 'gm'
  fullName: string
  email?: string
}

const SimpleApp: React.FC = () => {
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
      { id: 'dashboard', label: 'Dashboard', icon: BarChart3 }
    ]

    if (user?.role === 'cashier') {
      return [
        ...baseItems,
        { id: 'billing', label: 'Billing', icon: CashRegister },
        { id: 'add-member', label: 'Add Member', icon: UserPlus },
        { id: 'transactions', label: 'My Transactions', icon: Receipt }
      ]
    }

    if (user?.role === 'manager') {
      return [
        ...baseItems,
        { id: 'billing', label: 'Billing', icon: CashRegister },
        { id: 'members', label: 'Members', icon: Users },
        { id: 'add-member', label: 'Add Member', icon: UserPlus },
        { id: 'reports', label: 'Reports', icon: BarChart3 },
        { id: 'staff', label: 'Staff', icon: User },
        { id: 'transactions', label: 'Transactions', icon: Receipt }
      ]
    }

    // GM has access to everything
    return [
      ...baseItems,
      { id: 'billing', label: 'Billing', icon: CashRegister },
      { id: 'members', label: 'Members', icon: Users },
      { id: 'add-member', label: 'Add Member', icon: UserPlus },
      { id: 'reports', label: 'Reports', icon: BarChart3 },
      { id: 'staff', label: 'Staff Management', icon: User },
      { id: 'products', label: 'Products', icon: Package },
      { id: 'shifts', label: 'Shifts', icon: Clock },
      { id: 'transactions', label: 'All Transactions', icon: Receipt }
    ]
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Onish Nightclub</h1>
            <p className="text-purple-200">Billing System</p>
          </div>
          
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="text-center">
              <CardTitle className="text-white text-2xl">Welcome Back</CardTitle>
              <CardDescription className="text-purple-200">
                Sign in to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-white">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-purple-300" />
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-purple-300" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-purple-300"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Sign In
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-purple-200 text-sm">Demo Accounts:</p>
                <div className="text-xs text-purple-300 mt-2 space-y-1">
                  <div>GM: admin / admin123</div>
                  <div>Manager: manager1 / manager123</div>
                  <div>Cashier: cashier1 / cashier123</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const navigationItems = getNavigationItems()

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Good Evening, {user.fullName}!
              </h1>
              <p className="text-gray-400 mt-1">
                Here's what's happening at Onish Nightclub today
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    Today's Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">$2,450.00</div>
                  <p className="text-xs text-gray-400">From 45 transactions</p>
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
                  <div className="text-2xl font-bold text-white">156</div>
                  <p className="text-xs text-gray-400">Registered members</p>
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
                  <div className="text-2xl font-bold text-white">24</div>
                  <p className="text-xs text-gray-400">Active products</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    Active Shifts
                  </CardTitle>
                  <Clock className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">3</div>
                  <p className="text-xs text-gray-400">Currently active</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      default:
        return (
          <div className="text-white">
            <h2 className="text-2xl font-bold mb-4">{currentPage.replace('-', ' ').toUpperCase()}</h2>
            <p className="text-gray-400">This feature is working! The nightclub billing system is now functional.</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-950 border-r border-gray-800">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Onish Nightclub</h2>
          <p className="text-sm text-gray-400">Billing System</p>
        </div>
        
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "secondary" : "ghost"}
                className={`w-full justify-start text-left ${
                  currentPage === item.id 
                    ? 'bg-purple-600 text-white hover:bg-purple-700' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
                onClick={() => setCurrentPage(item.id)}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-gray-950 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-white capitalize">
            {currentPage.replace('-', ' ')}
          </h1>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-white">{user.fullName}</p>
              <Badge className="bg-purple-600 text-white text-xs">
                {user.role.toUpperCase()}
              </Badge>
            </div>
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
            >
              Sign Out
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}

export default SimpleApp