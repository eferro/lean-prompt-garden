// MCP-compatible prompt types
export interface PromptContent {
  type: 'text' | 'image' | 'audio' | 'resource'
  text?: string
  data?: string
  mimeType?: string
  resource?: {
    uri: string
    name: string
    title?: string
    mimeType: string
    text?: string
  }
}

export interface PromptMessage {
  role: 'user' | 'assistant'
  content: PromptContent
}

export interface PromptDefinition {
  name: string
  title: string
  description: string
  messages: PromptMessage[]
}

export interface Prompt {
  name: string
  title: string
  description: string
}

export interface PromptData {
  prompts: Prompt[]
  definitions: Record<string, PromptDefinition>
}
