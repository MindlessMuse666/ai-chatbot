export interface Chat {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
  lastMessage?: Message;
}

export interface Message {
  id: string;
  chatId: string;
  content: string;
  type: MessageType;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
  sender: MessageSender;
}

export enum MessageType {
  TEXT = 'TEXT',
  FILE = 'FILE',
}

export enum MessageSender {
  USER = 'USER',
  AI = 'AI',
}

export interface CreateChatDto {
  title?: string;
}

export interface UpdateChatDto {
  title: string;
}

export interface GetMessagesParams {
  chatId: string;
  page?: number;
  limit?: number;
}

export interface CreateMessageDto {
  chatId: string;
  content: string;
  type: MessageType;
}

export interface UpdateMessageDto {
  content: string;
} 