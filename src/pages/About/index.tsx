import { CodeBracketSquareIcon, LinkIcon } from '@heroicons/react/24/outline'

export default function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <CodeBracketSquareIcon className="h-16 w-16 text-indigo-600 mr-4" />
          <h1 className="text-4xl font-bold text-gray-900">
            Lean Prompt Garden
          </h1>
        </div>
        <p className="text-xl text-gray-600 leading-relaxed">
          A curated collection of software gardening prompts designed for lean development practices.
          Each prompt follows Test-Driven Development, Extreme Programming, and continuous improvement principles.
        </p>
      </div>

      {/* What is it Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">What is Lean Prompt Garden?</h2>
        <div className="prose prose-lg text-gray-600 max-w-none">
          <p>
            Lean Prompt Garden is a specialized collection of AI prompts designed specifically for software development teams 
            practicing lean methodologies. Each prompt is carefully crafted to support:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li><strong>Test-Driven Development (TDD):</strong> Prompts that guide you through the Red-Green-Refactor cycle</li>
            <li><strong>Extreme Programming (XP):</strong> Support for pair programming, continuous integration, and small releases</li>
            <li><strong>Continuous Improvement:</strong> Prompts for refactoring, code review, and technical debt management</li>
            <li><strong>Clean Code Practices:</strong> Guidance for writing maintainable, readable, and well-structured code</li>
          </ul>
        </div>
      </div>

      {/* Key Features */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🎯 Purpose-Built</h3>
            <p className="text-gray-600">
              Every prompt is designed with lean development principles in mind, focusing on delivering value while minimizing waste.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🔄 Iterative Approach</h3>
            <p className="text-gray-600">
              Prompts encourage small, incremental changes and continuous feedback loops for better outcomes.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🧪 Test-First Mindset</h3>
            <p className="text-gray-600">
              Built-in support for TDD practices, helping you write tests before implementation.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🔧 MCP Compatible</h3>
            <p className="text-gray-600">
              Fully compatible with Model Context Protocol for seamless integration with AI development tools.
            </p>
          </div>
        </div>
      </div>

      {/* How to Use */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Use</h2>
        <div className="prose prose-lg text-gray-600 max-w-none">
          <ol className="list-decimal pl-6 space-y-3">
            <li>
              <strong>Browse the Collection:</strong> Explore our curated prompts on the home page. Use the search function 
              to find prompts for specific tasks or technologies.
            </li>
            <li>
              <strong>Copy and Customize:</strong> Click on any prompt to view its details and copy it to your clipboard. 
              Customize the arguments to fit your specific context.
            </li>
            <li>
              <strong>Integrate with Your Workflow:</strong> Use the prompts with your preferred AI assistant or integrate 
              them into your development environment using our JSON API.
            </li>
            <li>
              <strong>Follow the Principles:</strong> Each prompt is designed to support lean practices. Follow the 
              suggested workflows for best results.
            </li>
          </ol>
        </div>
      </div>

      {/* API Integration */}
      <div className="bg-gray-50 rounded-lg p-8">
        <div className="flex items-center gap-2 mb-4">
          <LinkIcon className="h-6 w-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-900">API Integration</h2>
        </div>
        <p className="text-gray-600 mb-4">
          Access all prompts programmatically through our JSON API endpoint. Perfect for:
        </p>
        <ul className="list-disc pl-6 text-gray-600 space-y-1 mb-4">
          <li>CI/CD pipeline integration</li>
          <li>Custom development tools</li>
          <li>MCP-compatible applications</li>
          <li>Automated code review processes</li>
        </ul>
        <div className="bg-white rounded-md border p-4">
          <p className="text-sm text-gray-500 mb-2">API Endpoint</p>
          <code className="text-sm bg-gray-100 px-3 py-2 rounded block">
            {window.location.origin}{import.meta.env.BASE_URL}prompts.json
          </code>
          <div className="mt-3 text-sm text-gray-600">
            <p><strong>Format:</strong> JSON (MCP-compatible) • <strong>CORS:</strong> Enabled</p>
          </div>
        </div>
      </div>

      {/* Philosophy */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Philosophy</h2>
        <div className="prose prose-lg text-gray-600 max-w-none">
          <p>
            We believe that great software is grown, not built. Like tending a garden, software development requires 
            patience, care, and continuous attention. Our prompts embody this philosophy by:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Encouraging incremental improvements over massive rewrites</li>
            <li>Promoting collaboration and knowledge sharing</li>
            <li>Focusing on sustainable development practices</li>
            <li>Emphasizing quality over quantity</li>
            <li>Supporting continuous learning and adaptation</li>
          </ul>
          <p className="mt-4">
            Each prompt in our collection is a tool to help you cultivate better code, better practices, and better teams.
          </p>
        </div>
      </div>
    </div>
  )
}
