import React, { useState, useEffect } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeToggleProps {
  className?: string
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const [theme, setTheme] = useState<Theme>('system')
  const [mounted, setMounted] = useState(false)

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('shortcuts-theme') as Theme
    if (savedTheme) {
      setTheme(savedTheme)
      applyTheme(savedTheme)
    } else {
      setTheme('system')
      applyTheme('system')
    }
  }, [])

  // Apply theme to document
  const applyTheme = (newTheme: Theme) => {
    const root = window.document.documentElement

    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.remove('light', 'dark')
      root.classList.add(systemTheme)
    } else {
      root.classList.remove('light', 'dark')
      root.classList.add(newTheme)
    }
  }

  // Handle theme change
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    applyTheme(newTheme)
    localStorage.setItem('shortcuts-theme', newTheme)
  }

  // Listen for system theme changes
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => applyTheme('system')

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  // Prevent flash of incorrect theme
  if (!mounted) {
    return (
      <div className={`w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse ${className}`} />
    )
  }

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => handleThemeChange('light')}
          className={`flex items-center justify-center w-8 h-8 rounded-md transition-all ${
            theme === 'light'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
          title="Light theme"
        >
          <Sun className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleThemeChange('system')}
          className={`flex items-center justify-center w-8 h-8 rounded-md transition-all ${
            theme === 'system'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
          title="System theme"
        >
          <Monitor className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleThemeChange('dark')}
          className={`flex items-center justify-center w-8 h-8 rounded-md transition-all ${
            theme === 'dark'
              ? 'bg-gray-700 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
          title="Dark theme"
        >
          <Moon className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default ThemeToggle