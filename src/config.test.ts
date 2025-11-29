import { describe, it, expect, afterEach } from 'vitest'
import { getBasePath, getPromptsUrl } from './config'

describe('config', () => {
  const originalEnv = process.env.NODE_ENV

  afterEach(() => {
    process.env.NODE_ENV = originalEnv
  })

  describe('getBasePath', () => {
    it('should return /lean-prompt-garden for production environment', () => {
      process.env.NODE_ENV = 'production'
      expect(getBasePath()).toBe('/lean-prompt-garden')
    })

    it('should return empty string for development environment', () => {
      process.env.NODE_ENV = 'development'
      expect(getBasePath()).toBe('')
    })

    it('should return empty string for test environment', () => {
      process.env.NODE_ENV = 'test'
      expect(getBasePath()).toBe('')
    })
  })

  describe('getPromptsUrl', () => {
    it('should return correct URL for production environment', () => {
      process.env.NODE_ENV = 'production'
      expect(getPromptsUrl()).toBe('/lean-prompt-garden/prompts.json')
    })

    it('should return correct URL for development environment', () => {
      process.env.NODE_ENV = 'development'
      expect(getPromptsUrl()).toBe('/prompts.json')
    })
  })
})

