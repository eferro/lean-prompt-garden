// MCP-compatible prompt types
export interface PromptArgument {
  name: string
  description: string
  required: boolean
}

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
  arguments?: PromptArgument[]
}

export interface Prompt {
  name: string
  title: string
  description: string
  arguments?: PromptArgument[]
}

export interface PromptData {
  prompts: Prompt[]
  definitions: Record<string, PromptDefinition>
}
