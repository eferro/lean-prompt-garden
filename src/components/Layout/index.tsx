import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { CodeBracketSquareIcon } from '@heroicons/react/24/outline'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <CodeBracketSquareIcon className="h-8 w-8 text-indigo-600" />
                <span className="text-2xl font-bold text-gray-900">
                  Lean Prompt Garden
                </span>
              </Link>
            </div>
            <nav className="flex space-x-8">
              <Link
                to="/"
                className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
              >
                Home
              </Link>
              <a
                href="https://modelcontextprotocol.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
              >
                MCP Docs
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>
              A collection of gardening prompts for lean software development.
              Compatible with{' '}
              <a
                href="https://modelcontextprotocol.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-500"
              >
                Model Context Protocol
              </a>
              .
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
