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

export interface Prompt {
  name: string
  title: string
  description: string
  categories?: string[]
}

export interface PromptDefinition extends Prompt {
  messages: PromptMessage[]
}

export interface PromptData {
  prompts: Prompt[]
  definitions: Record<string, PromptDefinition>
}
