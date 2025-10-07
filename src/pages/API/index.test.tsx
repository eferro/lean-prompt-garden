import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import API from './index'

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(() => Promise.resolve()),
  },
})

describe('API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the main heading', () => {
    render(<API />)
    
    expect(screen.getByRole('heading', { name: /api documentation/i, level: 1 })).toBeInTheDocument()
  })

  it('should display the main description', () => {
    render(<API />)
    
    expect(screen.getByText(/access all lean prompt garden prompts programmatically/i)).toBeInTheDocument()
  })

  it('should show key sections', () => {
    render(<API />)
    
    expect(screen.getByRole('heading', { name: /quick start/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /example response/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /usage examples/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /mcp integration/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /best practices/i })).toBeInTheDocument()
  })

  const getExpectedEndpoint = () => {
    const basePath = import.meta.env.BASE_URL.endsWith('/')
      ? import.meta.env.BASE_URL
      : `${import.meta.env.BASE_URL}/`

    return `${window.location.origin}${basePath}prompts.json`
  }

  it('should display the API endpoint', () => {
    render(<API />)

    expect(screen.getByText(getExpectedEndpoint())).toBeInTheDocument()
  })

  it('should show API details', () => {
    render(<API />)
    
    expect(screen.getByText(/json \(mcp-compatible\)/i)).toBeInTheDocument()
    expect(screen.getByText(/enabled for cross-origin requests/i)).toBeInTheDocument()
    expect(screen.getByText(/complete prompt collection with definitions/i)).toBeInTheDocument()
  })

  it('should have copy button functionality', async () => {
    render(<API />)
    
    const copyButton = screen.getByRole('button', { name: /copy/i })
    expect(copyButton).toBeInTheDocument()
    
    fireEvent.click(copyButton)
    
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(getExpectedEndpoint())
    })
    
    expect(screen.getByText('Copied')).toBeInTheDocument()
  })

  it('should show usage examples for different languages', () => {
    render(<API />)
    
    expect(screen.getByText('cURL')).toBeInTheDocument()
    expect(screen.getByText('JavaScript')).toBeInTheDocument()
    expect(screen.getByText('Python')).toBeInTheDocument()
  })

  it('should display MCP integration information', () => {
    render(<API />)
    
    expect(screen.getByText(/model context protocol/i)).toBeInTheDocument()
    expect(screen.getByText(/mcp server configuration/i)).toBeInTheDocument()
  })

  it('should show best practices sections', () => {
    render(<API />)
    
    expect(screen.getByText(/performance/i)).toBeInTheDocument()
    expect(screen.getByText('🔧 Integration')).toBeInTheDocument()
    expect(screen.getByText(/cache responses locally/i)).toBeInTheDocument()
    expect(screen.getByText(/validate prompt arguments/i)).toBeInTheDocument()
  })

  it('should have support links', () => {
    render(<API />)
    
    expect(screen.getByText('Report Issues')).toBeInTheDocument()
    expect(screen.getByText('Discussions')).toBeInTheDocument()
    expect(screen.getByText('View on GitHub')).toBeInTheDocument()
  })

  it('should display code examples with proper formatting', () => {
    render(<API />)
    
    // Check for code blocks
    const codeElements = screen.getAllByText(/curl -X GET/i)
    expect(codeElements.length).toBeGreaterThan(0)
    
    // Check for JavaScript example
    expect(screen.getByText(/const response = await fetch/i)).toBeInTheDocument()
    
    // Check for Python example
    expect(screen.getByText(/import requests/i)).toBeInTheDocument()
  })
})
