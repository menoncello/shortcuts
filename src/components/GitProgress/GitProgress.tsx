import { cn } from '../../utils'

interface GitProgressProps {
  operation: 'clone' | 'pull' | 'fetch' | 'checking'
  progress?: number
  message?: string
  className?: string
}

export function GitProgress({
  operation,
  progress = 0,
  message,
  className = ''
}: GitProgressProps) {
  const operationMessages = {
    clone: 'Cloning repository...',
    pull: 'Pulling updates...',
    fetch: 'Fetching latest changes...',
    checking: 'Checking for updates...'
  }

  const displayMessage = message || operationMessages[operation]

  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-3', className)}>
      <div className="flex items-center space-x-3">
        {/* Loading Spinner */}
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600 dark:border-primary-400"></div>

        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {displayMessage}
          </p>
          {progress > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {progress}% complete
            </p>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {progress > 0 && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-primary-600 dark:bg-primary-500 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Indeterminate Progress (when no specific progress available) */}
      {progress === 0 && operation !== 'checking' && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div className="h-full bg-primary-600 dark:bg-primary-500 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  )
}