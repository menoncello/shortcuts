import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Search, X, Clock, TrendingUp } from 'lucide-react'

interface SearchSuggestion {
  text: string
  type: 'history' | 'popular'
  count?: number
}

interface SearchInputProps {
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
  debounceMs?: number
  shortcuts?: Array<{ keys: string; description: string; category: string }>
}

// Popular search suggestions based on common keyboard shortcuts
const POPULAR_SUGGESTIONS: SearchSuggestion[] = [
  { text: 'copy', type: 'popular', count: 5 },
  { text: 'paste', type: 'popular', count: 4 },
  { text: 'save', type: 'popular', count: 6 },
  { text: 'undo', type: 'popular', count: 3 },
  { text: 'navigation', type: 'popular', count: 8 },
  { text: 'window', type: 'popular', count: 7 }
]

export const SearchInput: React.FC<SearchInputProps> = ({
  onSearch,
  placeholder = 'Search by keys, description, or category...',
  className = '',
  debounceMs = 300,
  shortcuts = []
}) => {
  const [value, setValue] = useState('')
  const [isDebouncing, setIsDebouncing] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // Load search history from localStorage
  useEffect(() => {
    try {
      const history = localStorage.getItem('shortcuts-search-history')
      if (history) {
        setSearchHistory(JSON.parse(history))
      }
    } catch (error) {
      console.warn('Failed to load search history:', error)
    }
  }, [])

  // Save to search history
  const saveToHistory = (query: string) => {
    if (!query.trim()) return

    try {
      const updatedHistory = [
        query,
        ...searchHistory.filter(item => item !== query)
      ].slice(0, 5) // Keep only last 5 searches

      setSearchHistory(updatedHistory)
      localStorage.setItem('shortcuts-search-history', JSON.stringify(updatedHistory))
    } catch (error) {
      console.warn('Failed to save search history:', error)
    }
  }

  // Generate suggestions based on input and available shortcuts
  const generateSuggestions = useCallback((input: string) => {
    if (!input.trim()) {
      // Show search history when empty
      return searchHistory.map(item => ({
        text: item,
        type: 'history' as const
      }))
    }

    const inputLower = input.toLowerCase()
    const allSuggestions: SearchSuggestion[] = []

    // Add matching popular suggestions
    POPULAR_SUGGESTIONS.forEach(suggestion => {
      if (suggestion.text.toLowerCase().includes(inputLower)) {
        allSuggestions.push(suggestion)
      }
    })

    // Add matching shortcuts
    shortcuts.forEach(shortcut => {
      if (
        shortcut.keys.toLowerCase().includes(inputLower) ||
        shortcut.description.toLowerCase().includes(inputLower) ||
        shortcut.category.toLowerCase().includes(inputLower)
      ) {
        allSuggestions.push({
          text: shortcut.keys,
          type: 'popular',
          count: 1
        })
      }
    })

    // Add matching history
    searchHistory.forEach(item => {
      if (item.toLowerCase().includes(inputLower)) {
        allSuggestions.push({
          text: item,
          type: 'history' as const
        })
      }
    })

    // Remove duplicates and limit to 8 suggestions
    const uniqueSuggestions = allSuggestions
      .filter((suggestion, index, arr) =>
        arr.findIndex(s => s.text.toLowerCase() === suggestion.text.toLowerCase()) === index
      )
      .slice(0, 8)

    return uniqueSuggestions
  }, [searchHistory, shortcuts])

  // Update suggestions when input changes
  useEffect(() => {
    const newSuggestions = generateSuggestions(value)
    setSuggestions(newSuggestions)
  }, [value, generateSuggestions])

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout
      return (query: string) => {
        clearTimeout(timeoutId)
        setIsDebouncing(true)
        timeoutId = setTimeout(() => {
          onSearch(query)
          if (query.trim()) {
            saveToHistory(query)
          }
          setIsDebouncing(false)
        }, debounceMs)
      }
    })(),
    [onSearch, debounceMs, saveToHistory]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    setShowSuggestions(true)
    debouncedSearch(newValue)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false)
      inputRef.current?.blur()
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (showSuggestions && suggestions.length > 0) {
        handleSuggestionClick(suggestions[0].text)
      } else {
        debouncedSearch.cancel?.()
        onSearch(value)
        if (value.trim()) {
          saveToHistory(value)
        }
        setIsDebouncing(false)
        setShowSuggestions(false)
      }
    }
  }

  const handleSuggestionClick = (suggestionText: string) => {
    setValue(suggestionText)
    setShowSuggestions(false)
    onSearch(suggestionText)
    saveToHistory(suggestionText)
    inputRef.current?.focus()
  }

  const clearSearch = () => {
    setValue('')
    setShowSuggestions(false)
    onSearch('')
  }

  const handleInputFocus = () => {
    setShowSuggestions(true)
  }

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow click on suggestion
    setTimeout(() => setShowSuggestions(false), 150)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel?.()
    }
  }, [debouncedSearch])

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Search Shortcuts
      </label>
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          {isDebouncing && (
            <div className="absolute right-3 top-2.5">
              <div className="animate-spin h-4 w-4 border-2 border-primary-500 border-t-transparent rounded-full"></div>
            </div>
          )}
          {!isDebouncing && value && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Search Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
            <div className="max-h-64 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.text}-${index}`}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="w-full px-3 py-2 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg"
                >
                  {suggestion.type === 'history' ? (
                    <Clock className="h-4 w-4 text-gray-400" />
                  ) : (
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                  )}
                  <span className="flex-1 text-sm text-gray-900 dark:text-gray-100">
                    {suggestion.text}
                  </span>
                  {suggestion.count && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {suggestion.count} shortcuts
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchInput