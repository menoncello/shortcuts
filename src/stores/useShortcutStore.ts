import { create } from 'zustand'
import { invoke } from '@tauri-apps/api/core'
import type { Shortcut, App as Application, Category } from '@/types'

interface ShortcutStore {
  // State
  shortcuts: Shortcut[]
  apps: Application[]
  categories: Category[]
  selectedAppId: number | null
  selectedApp: string
  selectedCategory: string | undefined
  loading: boolean
  error: string

  // Computed properties
  getFilteredShortcuts: () => Shortcut[]
  getLearnedCount: () => number
  getTotalCount: () => number
  getProgressPercentage: () => number

  // Actions
  setLoading: (loading: boolean) => void
  setError: (error: string) => void
  loadApps: () => Promise<void>
  loadShortcuts: (appId?: number) => Promise<void>
  loadCategories: (appId?: number) => Promise<void>
  setFilteredShortcuts: (shortcuts: Shortcut[]) => void
  setSelectedApp: (appName: string, appId: number | null) => void
  setSelectedCategory: (category: string | undefined) => void
  toggleLearned: (shortcutId: number, currentLearned: boolean) => Promise<void>
  searchShortcuts: (query: string) => Promise<void>
  resetFilters: () => Promise<void>
}

export const useShortcutStore = create<ShortcutStore>((set, get) => ({
  // Initial state
  shortcuts: [],
  apps: [],
  categories: [],
  selectedAppId: null,
  selectedApp: '',
  selectedCategory: undefined,
  loading: true,
  error: '',

  // Computed property implementations
  getFilteredShortcuts: () => {
    const { shortcuts, selectedCategory } = get()
    return selectedCategory
      ? shortcuts.filter(shortcut => shortcut.category === selectedCategory)
      : shortcuts
  },

  getLearnedCount: () => {
    return get().shortcuts.filter(shortcut => shortcut.learned).length
  },

  getTotalCount: () => {
    return get().shortcuts.length
  },

  getProgressPercentage: () => {
    const learned = get().getLearnedCount()
    const total = get().getTotalCount()
    return total > 0 ? (learned / total) * 100 : 0
  },

  // Actions
  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  loadApps: async () => {
    try {
      const appsData = await invoke<Application[]>('get_apps')
      set({ apps: appsData })

      // Auto-select first app if available
      if (appsData.length > 0 && !get().selectedApp) {
        const firstApp = appsData[0]
        set({
          selectedApp: firstApp.name,
          selectedAppId: firstApp.id || null
        })
        get().loadShortcuts(firstApp.id)
      } else if (appsData.length === 0) {
        // No apps available, stop loading
        set({ loading: false })
      }
    } catch (err) {
      set({ error: 'Failed to load applications', loading: false })
      console.error('Error loading apps:', err)
    }
  },

  loadShortcuts: async (appId?: number) => {
    try {
      set({ loading: true, error: '' })
      const shortcutsData = await invoke<Shortcut[]>('get_shortcuts', { appId })
      set({ shortcuts: shortcutsData })
    } catch (err) {
      set({ error: 'Failed to load shortcuts' })
      console.error('Error loading shortcuts:', err)
    } finally {
      set({ loading: false })
    }
  },

  loadCategories: async (appId?: number) => {
    try {
      const categoriesData = await invoke<Category[]>('get_categories', { appId })
      set({ categories: categoriesData })
    } catch (err) {
      console.error('Error loading categories:', err)
      // Don't set error for categories - it's not critical
    }
  },

  setFilteredShortcuts: (shortcuts) => set({ shortcuts }),

  setSelectedApp: (appName, appId) => {
    set({
      selectedApp: appName,
      selectedAppId: appId,
      selectedCategory: undefined // Reset category filter when app changes
    })
    get().loadShortcuts(appId || undefined)
    get().loadCategories(appId || undefined)
  },

  setSelectedCategory: (category) => set({ selectedCategory: category }),

  toggleLearned: async (shortcutId, currentLearned) => {
    try {
      await invoke('update_shortcut_learned', {
        shortcutId,
        learned: !currentLearned
      })

      // Update local state
      set(state => ({
        shortcuts: state.shortcuts.map(shortcut =>
          shortcut.id === shortcutId
            ? { ...shortcut, learned: !currentLearned }
            : shortcut
        )
      }))
    } catch (err) {
      set({ error: 'Failed to update shortcut' })
      console.error('Error updating shortcut:', err)
    }
  },

  searchShortcuts: async (query) => {
    try {
      set({ loading: true, error: '' })
      if (query.trim()) {
        const searchResults = await invoke<Shortcut[]>('search_shortcuts', {
          query: query.trim(),
          appId: get().selectedAppId
        })
        set({ shortcuts: searchResults })
      } else {
        get().loadShortcuts(get().selectedAppId || undefined)
      }
    } catch (err) {
      set({ error: 'Failed to search shortcuts' })
      console.error('Error searching:', err)
    } finally {
      set({ loading: false })
    }
  },

  resetFilters: async () => {
    set({ selectedCategory: undefined })
    await get().loadShortcuts(get().selectedAppId || undefined)
  }
}))