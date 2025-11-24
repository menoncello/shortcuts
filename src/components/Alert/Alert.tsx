import { cn } from '../../utils'

interface AlertProps {
  variant: 'success' | 'error' | 'warning' | 'info'
  children: React.ReactNode
  className?: string
}

export function Alert({ variant, children, className = '' }: AlertProps) {
  const baseClasses = 'rounded-lg p-4 border'

  const variantClasses = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-100',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100'
  }

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)}>
      {children}
    </div>
  )
}