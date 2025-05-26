export interface Message {
    id: string
    role: string
    files?: string[]
    versions: Content[]
  }
  
export interface Content {
    content: string
    type: string
    createdAt: string
}

export interface MessageSendPayload {
    type: string
    content: string
    url?: string[]
}

export interface MessageSearchPayload {
    offset: number
    limit: number
}

export interface MessageResponse {
    total: number
    messages: Message[]
}


