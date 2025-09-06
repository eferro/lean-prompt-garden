import { Link } from 'react-router-dom'
import { DocumentDuplicateIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import type { Prompt } from '../../types/prompt'

interface PromptCardProps {
  prompt: Prompt
}

export default function PromptCard({ prompt }: PromptCardProps) {
  const argumentCount = prompt.arguments?.length || 0

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {prompt.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-3">
              {prompt.description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <DocumentDuplicateIcon className="h-4 w-4 mr-1" />
              {argumentCount} {argumentCount === 1 ? 'argument' : 'arguments'}
            </span>
          </div>

          <Link
            to={`/prompt/${prompt.name}`}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 border border-transparent rounded-md hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            View Details
            <ArrowTopRightOnSquareIcon className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
