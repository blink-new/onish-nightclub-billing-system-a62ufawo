import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from './ui/button'
import { Avatar, AvatarFallback } from './ui/avatar'
import { Badge } from './ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from './ui/sheet'
import {
  CashRegister,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  User,
  ShoppingCart,
  UserPlus,
  Receipt,
  Clock,
  Package,
  Shield
} from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
  currentPage: string
  onPageChange: (page: string) => void
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const { user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  if (!user) return null

  const getNavigationItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart3 }
    ]

    if (user.role === 'cashier') {
      return [
        ...baseItems,
        { id: 'billing', label: 'Billing', icon: CashRegister },
        { id: 'add-member', label: 'Add Member', icon: UserPlus },
        { id: 'transactions', label: 'My Transactions', icon: Receipt }
      ]
    }

    if (user.role === 'manager') {
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
      { id: 'staff', label: 'Staff Management', icon: Shield },
      { id: 'products', label: 'Products', icon: Package },
      { id: 'shifts', label: 'Shifts', icon: Clock },
      { id: 'transactions', label: 'All Transactions', icon: Receipt },
      { id: 'settings', label: 'Settings', icon: Settings }
    ]
  }

  const navigationItems = getNavigationItems()

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'gm': return 'bg-red-500'
      case 'manager': return 'bg-blue-500'
      case 'cashier': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const NavigationContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-xl font-bold text-white">Onish Nightclub</h2>
        <p className="text-sm text-gray-400">Billing System</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
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
              onClick={() => {
                onPageChange(item.id)
                setIsMobileMenuOpen(false)
              }}
            >
              <Icon className="mr-3 h-4 w-4" />
              {item.label}
            </Button>
          )
        })}
      </nav>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-gray-950 border-r border-gray-800">
        <NavigationContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-gray-950 border-gray-800">
          <NavigationContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Header */}
        <header className="bg-gray-950 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-white">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
            </Sheet>
            
            <h1 className="ml-4 text-xl font-semibold text-white capitalize">
              {currentPage.replace('-', ' ')}
            </h1>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-3 text-white hover:bg-gray-800">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-purple-600 text-white">
                    {user.fullName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{user.fullName}</p>
                  <div className="flex items-center space-x-2">
                    <Badge className={`text-xs ${getRoleBadgeColor(user.role)}`}>
                      {user.role.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-700">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium text-white">{user.fullName}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem 
                onClick={logout}
                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}