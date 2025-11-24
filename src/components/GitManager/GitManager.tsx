import { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/core'
import type {
  GitRepository,
  UpdateResult
} from '../../types'
import { Button } from '../Button'
import { Alert } from '../Alert'

interface GitManagerProps {
  className?: string
}

export function GitManager({ className = '' }: GitManagerProps) {
  const [repository, setRepository] = useState<GitRepository | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateResult, setUpdateResult] = useState<UpdateResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [repoUrl, setRepoUrl] = useState('https://github.com/shortcuts-app/shortcuts-data.git')
  const [isCloning, setIsCloning] = useState(false)

  useEffect(() => {
    checkRepositoryStatus()
  }, [])

  const checkRepositoryStatus = async () => {
    try {
      const [repoInfo] = await Promise.all([
        invoke<GitRepository>('git_get_repository_info'),
        invoke<boolean>('git_is_repository_up_to_date')
      ])

      setRepository(repoInfo)
    } catch (err) {
      // Repository might not exist yet
      setRepository(null)
    }
  }

  const handleCloneRepository = async () => {
    if (!repoUrl.trim()) {
      setError('Please enter a valid repository URL')
      return
    }

    setIsCloning(true)
    setError(null)

    try {
      const clonedRepo = await invoke<GitRepository>('git_clone_repository', {
        url: repoUrl
      })

      setRepository(clonedRepo)
      setUpdateResult({
        success: true,
        message: 'Repository cloned successfully',
        commits_ahead: 0,
        commits_behind: 0,
        last_commit_id: null
      })
    } catch (err) {
      setError(err as string)
    } finally {
      setIsCloning(false)
    }
  }

  const handleUpdateRepository = async () => {
    setIsUpdating(true)
    setError(null)
    setUpdateResult(null)

    try {
      const result = await invoke<UpdateResult>('git_pull_repository')
      setUpdateResult(result)

      if (result.success) {
        await checkRepositoryStatus()
      }
    } catch (err) {
      setError(err as string)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Git Repository Manager
        </h2>

        {/* Repository Status */}
        {repository ? (
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h3 className="font-medium text-green-900 dark:text-green-100 mb-2">
                Repository Connected
              </h3>
              <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
                <p><strong>URL:</strong> {repository.url}</p>
                <p><strong>Path:</strong> {repository.local_path}</p>
                <p><strong>Last Updated:</strong> {new Date(repository.last_updated).toLocaleString()}</p>
              </div>
            </div>

            <Button
              onClick={handleUpdateRepository}
              disabled={isUpdating}
              className="w-full"
            >
              {isUpdating ? 'Updating...' : 'Update Repository'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <h3 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                No Repository Connected
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Connect to a Git repository to enable automatic shortcut updates.
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Repository URL
              </label>
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/user/shortcuts-data.git"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />

              <Button
                onClick={handleCloneRepository}
                disabled={isCloning || !repoUrl.trim()}
                className="w-full"
              >
                {isCloning ? 'Cloning...' : 'Clone Repository'}
              </Button>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="error" className="mt-4">
            {error}
          </Alert>
        )}

        {/* Update Result */}
        {updateResult && (
          <Alert variant={updateResult.success ? 'success' : 'error'} className="mt-4">
            <div className="space-y-2">
              <p className="font-medium">{updateResult.message}</p>
              {updateResult.commits_ahead > 0 && (
                <p className="text-sm">
                  {updateResult.commits_ahead} new commits pulled
                </p>
              )}
              {updateResult.last_commit_id && (
                <p className="text-sm font-mono">
                  Latest commit: {updateResult.last_commit_id.substring(0, 8)}
                </p>
              )}
            </div>
          </Alert>
        )}
      </div>
    </div>
  )
}