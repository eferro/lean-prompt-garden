/**
 * Application configuration module.
 * Centralizes environment-specific settings to avoid hardcoded values.
 */

const PRODUCTION_BASE_PATH = '/lean-prompt-garden'

/**
 * Returns the base path for the application based on the current environment.
 * Production deployments use /lean-prompt-garden, other environments use root.
 */
export function getBasePath(): string {
  return process.env.NODE_ENV === 'production' ? PRODUCTION_BASE_PATH : ''
}

/**
 * Returns the full URL to the prompts.json file.
 */
export function getPromptsUrl(): string {
  const basePath = getBasePath()
  return `${basePath}/prompts.json`
}

