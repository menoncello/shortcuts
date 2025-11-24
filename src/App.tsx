import { useEffect, useState } from 'react'
import { ProgressBar, ShortcutCard, SearchInput, CategoryFilter, EmptyState, ThemeToggle } from '@/components'
import { useShortcutStore } from '@/stores'
import type { LearningProgress } from '@/types'
import './index.css'

function App() {
  const store = useShortcutStore()
  const [searchQuery, setSearchQuery] = useState('')

  // Get computed values
  const filteredShortcuts = store.getFilteredShortcuts()
  const learnedCount = store.getLearnedCount()
  const totalCount = store.getTotalCount()
  const progressPercentage = store.getProgressPercentage()

  // Initialize data
  useEffect(() => {
    store.loadApps()
  }, [])

  // Calculate progress
  const progress: LearningProgress = {
    total_shortcuts: totalCount,
    learned_shortcuts: learnedCount,
    mastery_percentage: progressPercentage,
    recently_learned: [],
    needs_practice: []
  }

  // Extract unique categories from filtered shortcuts
  const categories = Array.from(new Set(filteredShortcuts.map(s => s.category)))

  if (store.loading && store.apps.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Header */}
        <header className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Shortcuts Learning App
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Master keyboard shortcuts for your favorite applications
            </p>
          </div>
          <ThemeToggle className="ml-4" />
        </header>

        {/* Progress Bar */}
        <ProgressBar
          progress={progress}
          className="mb-6"
        />

        {/* Controls */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* App Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Application
            </label>
            <select
              value={store.selectedApp}
              onChange={(e) => {
                const appName = e.target.value
                const app = store.apps.find(a => a.name === appName)
                store.setSelectedApp(appName, app?.id || null)
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Applications</option>
              {store.apps.map((app) => (
                <option key={app.id} value={app.name}>
                  {app.name}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <SearchInput
            onSearch={(query) => {
              setSearchQuery(query)
              store.searchShortcuts(query)
            }}
            placeholder="Search by keys, description, or category..."
            shortcuts={store.shortcuts}
          />
        </div>

        {/* Error Message */}
        {store.error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
            {store.error}
          </div>
        )}

        {/* Category Filters */}
        <div className="mb-6">
          <CategoryFilter
            categories={categories}
            selectedCategory={store.selectedCategory}
            onCategorySelect={store.setSelectedCategory}
          />
        </div>

        {/* Shortcuts Grid */}
        {store.loading ? (
          <EmptyState type="loading" />
        ) : filteredShortcuts.length === 0 ? (
          <EmptyState
            type={searchQuery ? 'no-search-results' : 'no-shortcuts'}
            searchQuery={searchQuery}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredShortcuts.map((shortcut) => (
              <ShortcutCard
                key={shortcut.id}
                shortcut={shortcut}
                searchQuery={searchQuery}
                onToggleLearned={store.toggleLearned}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App