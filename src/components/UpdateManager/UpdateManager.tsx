import { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/core'
import type { GitRepository, UpdateResult } from '../../types'
import { Button } from '../Button'
import { Alert } from '../Alert'

interface UpdateManagerProps {
  repository: GitRepository | null
  onUpdateComplete?: (result: UpdateResult) => void
}

export function UpdateManager({ repository, onUpdateComplete }: UpdateManagerProps) {
  const [isChecking, setIsChecking] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [lastCheck, setLastCheck] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [autoCheckEnabled, setAutoCheckEnabled] = useState(true)

  useEffect(() => {
    if (repository && autoCheckEnabled) {
      checkForUpdates()
    }
  }, [repository, autoCheckEnabled])

  const checkForUpdates = async () => {
    if (!repository) return

    setIsChecking(true)
    setError(null)

    try {
      const isUpToDate = await invoke<boolean>('git_is_repository_up_to_date')
      setUpdateAvailable(!isUpToDate)
      setLastCheck(new Date())
    } catch (err) {
      setError('Failed to check for updates')
    } finally {
      setIsChecking(false)
    }
  }

  const handleUpdate = async () => {
    if (!repository) return

    setIsUpdating(true)
    setError(null)

    try {
      const result = await invoke<UpdateResult>('git_pull_repository')
      setUpdateAvailable(false)
      onUpdateComplete?.(result)
    } catch (err) {
      setError(err as string)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Update Manager
        </h3>

        <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <input
            type="checkbox"
            checked={autoCheckEnabled}
            onChange={(e) => setAutoCheckEnabled(e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
          />
          <span>Auto-check</span>
        </label>
      </div>

      {/* Repository Status */}
      {repository ? (
        <div className="space-y-3">
          {updateAvailable ? (
            <Alert variant="warning">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Updates Available</p>
                  <p className="text-sm">New shortcuts are ready to be downloaded</p>
                </div>
                <Button
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  variant="primary"
                  className="ml-4"
                >
                  {isUpdating ? 'Updating...' : 'Update Now'}
                </Button>
              </div>
            </Alert>
          ) : (
            <Alert variant="success">
              <p className="font-medium">Up to Date</p>
              <p className="text-sm">You have the latest shortcuts</p>
            </Alert>
          )}

          {/* Last Check Info */}
          {lastCheck && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Last checked: {lastCheck.toLocaleString()}
              <Button
                onClick={checkForUpdates}
                disabled={isChecking}
                variant="secondary"
                className="ml-2 text-xs px-2 py-1"
              >
                {isChecking ? 'Checking...' : 'Check Now'}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Alert variant="info">
          <p className="text-sm">Connect to a repository to enable automatic updates</p>
        </Alert>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="error">
          {error}
        </Alert>
      )}
    </div>
  )
}