import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'accent' | 'high-priority' | 'medium-priority' | 'low-priority'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-linkedin-500 focus:ring-offset-2'
  
  const variantClasses = {
    default: 'bg-linkedin-100 text-linkedin-800 hover:bg-linkedin-200',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    destructive: 'bg-red-100 text-red-800 hover:bg-red-200',
    outline: 'border border-linkedin-200 text-linkedin-700',
    success: 'bg-green-100 text-green-800 hover:bg-green-200',
    warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    accent: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
    'high-priority': 'bg-red-500 text-white',
    'medium-priority': 'bg-yellow-500 text-white',
    'low-priority': 'bg-green-500 text-white'
  }
  
  return (
    <div className={cn(baseClasses, variantClasses[variant], className)} {...props} />
  )
}

export { Badge } 