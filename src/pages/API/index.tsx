import { useState } from 'react'
import { CodeBracketIcon, DocumentDuplicateIcon, CheckIcon } from '@heroicons/react/24/outline'

export default function API() {
  const [copied, setCopied] = useState(false)
  const apiEndpoint = (() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const basePath = import.meta.env.BASE_URL?.length ? import.meta.env.BASE_URL : '/'
    const normalizedBasePath = basePath.endsWith('/') ? basePath : `${basePath}/`

    return `${origin}${normalizedBasePath}prompts.json`
  })()

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(apiEndpoint)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <CodeBracketIcon className="h-16 w-16 text-indigo-600 mr-4" />
          <h1 className="text-4xl font-bold text-gray-900">
            API Documentation
          </h1>
        </div>
        <p className="text-xl text-gray-600 leading-relaxed">
          Access all Lean Prompt Garden prompts programmatically via our JSON API.
          Perfect for integrating with your tools, CI/CD pipelines, or MCP-compatible applications.
        </p>
      </div>

      {/* Quick Start */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Quick Start
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Endpoint
            </label>
            <div className="flex items-center space-x-2">
              <code className="flex-1 bg-gray-100 px-4 py-2 rounded text-sm font-mono">
                {apiEndpoint}
              </code>
              <button
                onClick={copyToClipboard}
                className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
              >
                {copied ? (
                  <>
                    <CheckIcon className="h-4 w-4 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <DocumentDuplicateIcon className="h-4 w-4 mr-1" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-semibold text-gray-700">Format:</span>
              <span className="ml-2 text-gray-600">JSON (MCP-compatible)</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">CORS:</span>
              <span className="ml-2 text-gray-600">Enabled for cross-origin requests</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Response:</span>
              <span className="ml-2 text-gray-600">Complete prompt collection with definitions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Example Response */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Example Response
        </h2>
        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-green-400 text-sm">
{`{
  "prompts": [
    {
      "name": "tdd-red-green-refactor",
      "description": "Implement TDD cycle: write failing test, make it pass, refactor",
      "arguments": [
        {
          "name": "feature",
          "description": "The feature or functionality to implement",
          "required": true
        }
      ]
    },
    {
      "name": "extreme-programming-practices",
      "description": "Apply XP practices: pair programming, continuous integration, simple design",
      "arguments": [
        {
          "name": "practice",
          "description": "Specific XP practice to focus on",
          "required": false
        }
      ]
    }
  ]
}`}
          </pre>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Usage Examples
        </h2>
        
        <div className="space-y-6">
          {/* cURL Example */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">cURL</h3>
            <div className="bg-gray-100 rounded p-3 overflow-x-auto">
              <code className="text-sm">
                curl -X GET "{apiEndpoint}"
              </code>
            </div>
          </div>

          {/* JavaScript Example */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">JavaScript</h3>
            <div className="bg-gray-100 rounded p-3 overflow-x-auto">
              <pre className="text-sm">
{`// Fetch all prompts
const response = await fetch('${apiEndpoint}');
const data = await response.json();

// Use a specific prompt
const tddPrompt = data.prompts.find(p => p.name === 'tdd-red-green-refactor');
console.log(tddPrompt.description);`}
              </pre>
            </div>
          </div>

          {/* Python Example */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Python</h3>
            <div className="bg-gray-100 rounded p-3 overflow-x-auto">
              <pre className="text-sm">
{`import requests

# Fetch all prompts
response = requests.get('${apiEndpoint}')
data = response.json()

# Filter prompts by category
tdd_prompts = [p for p in data['prompts'] if 'tdd' in p['name']]
print(f"Found {len(tdd_prompts)} TDD prompts")`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* MCP Integration */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          MCP Integration
        </h2>
        <div className="space-y-4">
          <p className="text-gray-600">
            This API is fully compatible with the Model Context Protocol (MCP). You can use it directly
            with MCP-compatible AI assistants and development tools.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <h3 className="font-semibold text-blue-900 mb-2">MCP Server Configuration</h3>
            <div className="bg-blue-900 rounded p-3 overflow-x-auto">
              <pre className="text-blue-100 text-sm">
{`{
  "mcpServers": {
    "lean-prompt-garden": {
      "command": "npx",
      "args": ["@lean-prompt-garden/mcp-server"],
      "env": {
        "API_ENDPOINT": "${apiEndpoint}"
      }
    }
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Best Practices
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">🚀 Performance</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Cache responses locally when possible</li>
              <li>• Use conditional requests with ETags</li>
              <li>• Filter prompts on the client side</li>
              <li>• Implement retry logic for network errors</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">🔧 Integration</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Validate prompt arguments before use</li>
              <li>• Handle missing or optional arguments gracefully</li>
              <li>• Log API usage for debugging</li>
              <li>• Consider prompt versioning in your application</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Support */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Support & Contributing
        </h2>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            Need help or want to contribute? We welcome feedback and contributions to make the API better.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <a
              href="https://github.com/lean-prompt-garden/issues"
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              Report Issues
            </a>
            <a
              href="https://github.com/lean-prompt-garden/discussions"
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              Discussions
            </a>
            <a
              href="https://github.com/lean-prompt-garden"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
