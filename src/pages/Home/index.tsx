import { useState, useMemo } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import PromptCard from '../../components/PromptCard'
import SearchBox from '../../components/SearchBox'
import { usePrompts } from '../../hooks/usePrompts'

export default function Home() {
  const { prompts, loading, error } = usePrompts()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPrompts = useMemo(() => {
    if (!searchQuery) return prompts

    const query = searchQuery.toLowerCase()
    return prompts.filter(
      (prompt) =>
        prompt.title.toLowerCase().includes(query) ||
        prompt.description.toLowerCase().includes(query) ||
        prompt.name.toLowerCase().includes(query)
    )
  }, [prompts, searchQuery])

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
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Lean Prompt Garden
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          A curated collection of software gardening prompts designed for lean development practices.
          Each prompt follows Test-Driven Development, Extreme Programming, and continuous improvement principles.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto">
        <SearchBox
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search prompts by name, title, or description..."
        />
      </div>

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
