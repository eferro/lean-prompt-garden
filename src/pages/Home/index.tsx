import { useState, useMemo } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import PromptCard from '../../components/PromptCard'
import SearchBox from '../../components/SearchBox'
import { usePrompts } from '../../hooks/usePrompts'
import { filterPrompts } from '../../utils/filterPrompts'

export default function Home() {
  const { prompts, loading, error } = usePrompts()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = useMemo(() => {
    const categorySet = new Set<string>()
    prompts.forEach((prompt) => {
      prompt.categories?.forEach((category) => categorySet.add(category))
    })
    return Array.from(categorySet).sort()
  }, [prompts])

  const filteredPrompts = useMemo(() => {
    return filterPrompts(prompts, searchQuery, selectedCategory)
  }, [prompts, searchQuery, selectedCategory])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-600 min-h-64 flex items-center justify-center">
        <p>Error loading prompts: {error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Search */}
      <div className="max-w-2xl mx-auto">
        <SearchBox
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search prompts by name, title, or description..."
        />
      </div>

      {/* Category filters */}
      {categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-gray-600">Quick filter:</span>
          <button
            type="button"
            onClick={() => setSelectedCategory(null)}
            className={`rounded-full px-4 py-1 text-sm font-medium transition-colors border ${
              selectedCategory === null
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            All categories
          </button>
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-4 py-1 text-sm font-medium transition-colors border ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="text-center">
        <p className="text-gray-600">
          Found {filteredPrompts.length} of {prompts.length} prompts
        </p>
      </div>

      {/* Prompts Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPrompts.map((prompt) => (
          <PromptCard key={prompt.name} prompt={prompt} />
        ))}
      </div>

      {/* Empty State */}
      {filteredPrompts.length === 0 && searchQuery && (
        <div className="text-center py-16">
          <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No prompts found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search terms or browse all prompts.
          </p>
        </div>
      )}
    </div>
  )
}
