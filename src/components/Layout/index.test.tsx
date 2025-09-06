import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import React from 'react'
import Layout from './index'

// Helper function to render Layout with router
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  )
}

describe('Layout', () => {
  it('should render navigation header with title and logo', () => {
    renderWithRouter(<Layout>Test Content</Layout>)

    // Should display the title
    expect(screen.getByText('Lean Prompt Garden')).toBeInTheDocument()
    
    // Should have Home navigation link
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
    
    // Should have MCP Docs external link
    const mcpDocsLink = screen.getByRole('link', { name: /mcp docs/i })
    expect(mcpDocsLink).toBeInTheDocument()
    expect(mcpDocsLink).toHaveAttribute('href', 'https://modelcontextprotocol.io')
    expect(mcpDocsLink).toHaveAttribute('target', '_blank')
  })

  it('should render content area with children', () => {
    const testContent = 'This is test content for the main area'
    
    renderWithRouter(<Layout>{testContent}</Layout>)

    expect(screen.getByText(testContent)).toBeInTheDocument()
  })

  it('should render footer with project information', () => {
    renderWithRouter(<Layout>Test</Layout>)

    // Should show project description
    expect(screen.getByText(/collection of gardening prompts/i)).toBeInTheDocument()
    
    // Should have link to MCP in footer
    const footerMcpLink = screen.getByText('Model Context Protocol')
    expect(footerMcpLink).toBeInTheDocument()
    expect(footerMcpLink.closest('a')).toHaveAttribute('href', 'https://modelcontextprotocol.io')
  })

  it('should have proper structure with header, main, and footer', () => {
    renderWithRouter(<Layout>Main Content</Layout>)

    // Check if header exists
    expect(screen.getByRole('banner')).toBeInTheDocument()
    
    // Check if main content area exists
    expect(screen.getByRole('main')).toBeInTheDocument()
    
    // Check if footer exists  
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('should have title link that navigates to home', () => {
    renderWithRouter(<Layout>Test</Layout>)

    const titleLink = screen.getByRole('link', { name: /lean prompt garden/i })
    expect(titleLink).toHaveAttribute('href', '/')
  })
})
