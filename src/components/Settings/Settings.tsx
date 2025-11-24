import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import type { GitRepository } from '@/types'
import { Button } from '../Button'
import { Alert } from '../Alert'

interface SettingsProps {
  repository?: GitRepository | null
  onRepositoryChange?: (repository: GitRepository | null) => void
}

interface SettingsState {
  autoUpdateEnabled: boolean
  updateFrequencyHours: number
  showNotifications: boolean
  theme: 'light' | 'dark' | 'system'
  loading: boolean
  error: string | null
  success: string | null
}

export function Settings({ repository, onRepositoryChange }: SettingsProps) {
  const [settings, setSettings] = useState<SettingsState>({
    autoUpdateEnabled: true,
    updateFrequencyHours: 24,
    showNotifications: true,
    theme: 'system',
    loading: false,
    error: null,
    success: null
  })

  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleSaveSettings = async () => {
    setSettings(prev => ({ ...prev, loading: true, error: null, success: null }))

    try {
      // Save settings to Tauri config (implement backend command later)
      await invoke('save_settings', {
        settings: {
          autoUpdateEnabled: settings.autoUpdateEnabled,
          updateFrequencyHours: settings.updateFrequencyHours,
          showNotifications: settings.showNotifications,
          theme: settings.theme
        }
      })

      setSettings(prev => ({ ...prev, loading: false, success: 'Settings saved successfully!' }))

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSettings(prev => ({ ...prev, success: null }))
      }, 3000)

    } catch (err) {
      setSettings(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to save settings: ' + (err as Error).message
      }))
    }
  }

  const handleTestConnection = async () => {
    if (!repository) return

    setSettings(prev => ({ ...prev, loading: true, error: null, success: null }))

    try {
      const isConnected = await invoke<boolean>('git_test_connection', {
        url: repository.url
      })

      setSettings(prev => ({
        ...prev,
        loading: false,
        success: isConnected ? '✅ Connection successful!' : '❌ Connection failed'
      }))

      setTimeout(() => {
        setSettings(prev => ({ ...prev, success: null }))
      }, 3000)

    } catch (err) {
      setSettings(prev => ({
        ...prev,
        loading: false,
        error: 'Connection test failed: ' + (err as Error).message
      }))
    }
  }

  const handleResetSettings = () => {
    setSettings({
      autoUpdateEnabled: true,
      updateFrequencyHours: 24,
      showNotifications: true,
      theme: 'system',
      loading: false,
      error: null,
      success: null
    })
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Settings
        </h2>
        <Button
          onClick={() => setShowAdvanced(!showAdvanced)}
          variant="secondary"
          className="text-sm"
        >
          {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
        </Button>
      </div>

      {/* Success/Error Messages */}
      {settings.success && (
        <Alert variant="success">
          {settings.success}
        </Alert>
      )}

      {settings.error && (
        <Alert variant="error">
          {settings.error}
        </Alert>
      )}

      {/* General Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          General
        </h3>

        {/* Theme */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Theme
          </label>
          <select
            value={settings.theme}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              theme: e.target.value as 'light' | 'dark' | 'system'
            }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="system">System Default</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        {/* Notifications */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="showNotifications"
            checked={settings.showNotifications}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              showNotifications: e.target.checked
            }))}
            className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="showNotifications" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Show notifications for updates and changes
          </label>
        </div>
      </div>

      {/* Git Settings */}
      {showAdvanced && (
        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Git Repository
          </h3>

          {/* Repository Status */}
          {repository ? (
            <div className="space-y-3">
              <div className="text-sm">
                <div className="font-medium text-gray-700 dark:text-gray-300">Repository URL:</div>
                <div className="text-gray-600 dark:text-gray-400 font-mono text-xs break-all">
                  {repository.url}
                </div>
              </div>

              <div className="text-sm">
                <div className="font-medium text-gray-700 dark:text-gray-300">Local Path:</div>
                <div className="text-gray-600 dark:text-gray-400 font-mono text-xs">
                  {repository.local_path}
                </div>
              </div>

              <div className="text-sm">
                <div className="font-medium text-gray-700 dark:text-gray-300">Last Updated:</div>
                <div className="text-gray-600 dark:text-gray-400">
                  {repository.last_updated ? new Date(repository.last_updated).toLocaleString() : 'Never'}
                </div>
              </div>

              <Button
                onClick={handleTestConnection}
                disabled={settings.loading}
                variant="secondary"
                className="text-sm"
              >
                Test Connection
              </Button>
            </div>
          ) : (
            <Alert variant="info">
              No Git repository configured. Use the Git Manager to connect a repository.
            </Alert>
          )}
        </div>
      )}

      {/* Advanced Settings */}
      {showAdvanced && (
        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Advanced
          </h3>

          {/* Auto Update */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoUpdateEnabled"
              checked={settings.autoUpdateEnabled}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                autoUpdateEnabled: e.target.checked
              }))}
              className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="autoUpdateEnabled" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Enable automatic updates
            </label>
          </div>

          {/* Update Frequency */}
          {settings.autoUpdateEnabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Update Frequency
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  max="168"
                  value={settings.updateFrequencyHours}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    updateFrequencyHours: parseInt(e.target.value) || 24
                  }))}
                  className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">hours</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                How often to check for updates (1-168 hours)
              </p>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          onClick={handleResetSettings}
          variant="secondary"
          disabled={settings.loading}
        >
          Reset to Defaults
        </Button>

        <Button
          onClick={handleSaveSettings}
          disabled={settings.loading}
          variant="primary"
        >
          {settings.loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  )
}

export default Settings