import React from 'react'
import type { LearningProgress } from '@/types'

interface ProgressBarProps {
  progress: LearningProgress
  className?: string
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  className = ''
}) => {
  const {
    total_shortcuts,
    learned_shortcuts,
    mastery_percentage
  } = progress

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Progress
        </span>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {learned_shortcuts} of {total_shortcuts} learned ({Math.round(mastery_percentage)}%)
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-green-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${mastery_percentage}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar