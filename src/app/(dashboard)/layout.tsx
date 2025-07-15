'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  LogOut,
  Bell,
  Search,
  User,
  Send
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Posts', href: '/dashboard/posts', icon: FileText },
  { name: 'Secuencias', href: '/dashboard/sequences', icon: Send },
  { name: 'Mensajes', href: '/dashboard/messages', icon: MessageSquare },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Configuración', href: '/dashboard/settings', icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="linkedin-header">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-linkedin-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Simplificando → Hapiick</span>
            </Link>
            
            {/* Search Bar */}
            <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-80">
              <Search className="w-4 h-4 text-gray-500 mr-2" />
              <input 
                type="text" 
                placeholder="Buscar contenido, leads, métricas..." 
                className="bg-transparent border-none outline-none flex-1 text-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:text-linkedin-500 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-linkedin-500 transition-colors">
              <User className="w-5 h-5" />
            </button>
            <Link 
              href="/"
              className="flex items-center space-x-2 text-gray-500 hover:text-linkedin-500 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Salir</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm h-screen sticky top-0 pt-6">
          <div className="px-6 mb-8">
            <div className="flex items-center space-x-3 p-3 bg-linkedin-50 rounded-lg">
              <div className="w-10 h-10 bg-linkedin-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">S</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Simplificando</p>
                <p className="text-sm text-gray-500">Demo para Hapiick</p>
              </div>
            </div>
          </div>
          
          <div className="px-3">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || 
                (item.href !== '/dashboard' && pathname.startsWith(item.href))
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-1',
                    isActive 
                      ? 'bg-linkedin-50 text-linkedin-700 border-r-2 border-linkedin-500' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-linkedin-600'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>
          
          {/* Demo Notice */}
          <div className="px-6 mt-8">
            <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                <span className="text-sm font-medium text-warning-800">Propuesta Demo</span>
              </div>
              <p className="text-xs text-warning-700">
                Demo interactiva de Simplificando mostrando la estrategia de LinkedIn propuesta para Hapiick. 
                Datos simulados con proyecciones realistas.
              </p>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
} 