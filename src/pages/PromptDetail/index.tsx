import { useParams, Link, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { 
  ArrowLeftIcon, 
  CheckIcon,
  ClipboardDocumentIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { usePromptDetail } from '../../hooks/usePromptDetail'
import PromptRenderer from '../../components/PromptRenderer'

export default function PromptDetail() {
  const { name = '' } = useParams<{ name: string }>()
  const { prompt, loading, error } = usePromptDetail(name)
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)

  // Guard: redirect to home if name is missing or empty
  if (!name || name.trim() === '') {
    return <Navigate to="/" replace />
  }

  const handleCopyPrompt = async () => {
    if (!prompt) return

    const text = prompt.messages[0]?.content?.text || ''
    
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setCopyError(false)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
      setCopyError(true)
      setCopied(false)
      setTimeout(() => setCopyError(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error || !prompt) {
    return (
      <div className="text-center">
        <div className="text-red-600 mb-4">
          <p>Error: {error || 'Prompt not found'}</p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 border border-transparent rounded-md hover:bg-indigo-100"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="mr-1 h-4 w-4" />
          Back to prompts
        </Link>
        
        <button
          onClick={handleCopyPrompt}
          className={`inline-flex items-center px-3 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            copyError 
              ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
              : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
          }`}
        >
          {copyError ? (
            <>
              <ExclamationTriangleIcon className="mr-2 h-4 w-4" />
              Copy failed
            </>
          ) : copied ? (
            <>
              <CheckIcon className="mr-2 h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <ClipboardDocumentIcon className="mr-2 h-4 w-4" />
              Copy Prompt
            </>
          )}
        </button>
      </div>

      {/* Prompt Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {prompt.title}
          </h1>
          <p className="text-gray-600 text-lg">
            {prompt.description}
          </p>
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
            {prompt.name}
          </span>
        </div>
      </div>

      {/* Prompt Content */}
      <PromptRenderer prompt={prompt} />
    </div>
  )
}
