import React from 'react'
import type { Shortcut } from '@/types'

interface ShortcutCardProps {
  shortcut: Shortcut
  onToggleLearned: (shortcutId: number, currentLearned: boolean) => void
  searchQuery?: string
  className?: string
}

// Utility function to highlight search matches
const highlightText = (text: string, query: string): React.ReactNode => {
  if (!query.trim()) return text

  const parts = text.split(new RegExp(`(${query})`, 'gi'))
  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 px-1 rounded">
        {part}
      </mark>
    ) : (
      part
    )
  )
}

export const ShortcutCard: React.FC<ShortcutCardProps> = ({
  shortcut,
  onToggleLearned,
  searchQuery = '',
  className = ''
}) => {
  const handleToggle = () => {
    if (shortcut.id) {
      onToggleLearned(shortcut.id, shortcut.learned)
    }
  }

  return (
    <div
      className={`shortcut-card p-4 border rounded-lg transition-all hover:shadow-md ${
        shortcut.learned
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
      } ${className}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="font-mono text-lg font-bold text-gray-900 dark:text-white mb-1">
            {highlightText(shortcut.keys, searchQuery)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {highlightText(shortcut.category || '', searchQuery)}
          </div>
        </div>
        <button
          onClick={handleToggle}
          className={`ml-2 px-2 py-1 text-xs font-medium rounded-full transition-colors ${
            shortcut.learned
              ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800'
              : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800'
          }`}
        >
          {shortcut.learned ? 'Learned ✓' : 'Not Learned'}
        </button>
      </div>
      <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
        {highlightText(shortcut.description, searchQuery)}
      </p>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {highlightText(shortcut.app_name, searchQuery)}
      </div>
    </div>
  )
}

export default ShortcutCard