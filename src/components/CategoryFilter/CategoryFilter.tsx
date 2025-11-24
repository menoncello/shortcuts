import React from 'react'

interface CategoryFilterProps {
  categories: string[]
  selectedCategory?: string
  onCategorySelect: (category: string | undefined) => void
  className?: string
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
  className = ''
}) => {
  if (categories.length <= 1) {
    return null // Don't show filter if only one or no categories
  }

  const handleSelectAll = () => {
    onCategorySelect(undefined)
  }

  const handleSelectCategory = (category: string) => {
    onCategorySelect(category === selectedCategory ? undefined : category)
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <button
        onClick={handleSelectAll}
        className={`px-3 py-1 text-sm rounded-full transition-colors ${
          !selectedCategory
            ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
      >
        All Categories
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleSelectCategory(category)}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${
            selectedCategory === category
              ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter