import React from 'react'
import { Search, BookOpen, Target, Sparkles } from 'lucide-react'

interface EmptyStateProps {
  type: 'no-shortcuts' | 'no-search-results' | 'loading'
  searchQuery?: string
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  searchQuery = '',
  className = ''
}) => {
  const renderContent = () => {
    switch (type) {
      case 'loading':
        return {
          icon: <div className="animate-pulse">
            <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>,
          title: 'Loading Shortcuts...',
          description: 'Fetching your keyboard shortcuts from the database.'
        }

      case 'no-search-results':
        return {
          icon: <Search className="h-12 w-12 text-gray-400" />,
          title: `No results for "${searchQuery}"`,
          description: 'Try searching with different keywords or browse by category.'
        }

      case 'no-shortcuts':
      default:
        return {
          icon: <BookOpen className="h-12 w-12 text-gray-400" />,
          title: 'No Shortcuts Available',
          description: 'Select an application to view available keyboard shortcuts.'
        }
    }
  }

  const { icon, title, description } = renderContent()

  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
        {description}
      </p>

      {/* Quick tips for search empty state */}
      {type === 'no-search-results' && (
        <div className="mt-8 text-left max-w-sm mx-auto">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <Target className="h-4 w-4" />
            Search Tips:
          </h4>
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-2">
            <li className="flex items-start gap-2">
              <Sparkles className="h-3 w-3 mt-0.5 flex-shrink-0" />
              Search by shortcut keys (e.g., "Ctrl+C")
            </li>
            <li className="flex items-start gap-2">
              <Sparkles className="h-3 w-3 mt-0.5 flex-shrink-0" />
              Search by action (e.g., "copy", "save")
            </li>
            <li className="flex items-start gap-2">
              <Sparkles className="h-3 w-3 mt-0.5 flex-shrink-0" />
              Search by category (e.g., "navigation", "editing")
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default EmptyState