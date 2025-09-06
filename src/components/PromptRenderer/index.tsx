import ReactMarkdown from 'react-markdown'
import type { PromptDefinition } from '../../types/prompt'

interface PromptRendererProps {
  prompt: PromptDefinition
  argumentValues: Record<string, string>
}

export default function PromptRenderer({ prompt, argumentValues }: PromptRendererProps) {
  const renderPromptText = (text: string, args: Record<string, string>) => {
    return Object.keys(args).reduce((result, key) => {
      const value = args[key] || `{{${key}}}`
      return result.replace(new RegExp(`{{${key}}}`, 'g'), value)
    }, text)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Prompt Preview
      </h3>
      
      <div className="space-y-4">
        {prompt.messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              message.role === 'user'
                ? 'bg-blue-50 border border-blue-200'
                : 'bg-gray-50 border border-gray-200'
            }`}
          >
            <div className="flex items-center mb-2">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-md ${
                  message.role === 'user'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {message.role}
              </span>
            </div>
            
            {message.content.type === 'text' && message.content.text && (
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>
                  {renderPromptText(message.content.text, argumentValues)}
                </ReactMarkdown>
              </div>
            )}
            
            {message.content.type === 'resource' && message.content.resource && (
              <div className="bg-white p-3 rounded border">
                <h4 className="font-medium text-gray-900 mb-1">
                  {message.content.resource.title || message.content.resource.name}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  URI: {message.content.resource.uri}
                </p>
                {message.content.resource.text && (
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>
                      {message.content.resource.text}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
