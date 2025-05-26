import { apiClient } from '@/shared/api/api-client';
import type {
  Chat,
  CreateChatDto,
  UpdateChatDto,
  Message,
  GetMessagesParams,
  CreateMessageDto,
  UpdateMessageDto,
} from '../model/types';

export const chatApi = {
  // Chat operations
  getChats: async (): Promise<Chat[]> => {
    const response = await apiClient.get('/chat');
    return response.data;
  },

  getArchivedChats: async (): Promise<Chat[]> => {
    const response = await apiClient.get('/chat/archived');
    return response.data;
  },

  createChat: async (dto: CreateChatDto): Promise<Chat> => {
    const response = await apiClient.post('/chat', dto);
    return response.data;
  },

  updateChat: async (id: string, dto: UpdateChatDto): Promise<Chat> => {
    const response = await apiClient.put(`/chat/${id}`, dto);
    return response.data;
  },

  deleteChat: async (id: string): Promise<void> => {
    await apiClient.delete(`/chat/${id}`);
  },

  hardDeleteChat: async (id: string): Promise<void> => {
    await apiClient.delete(`/chat/${id}/hard`);
  },

  archiveChat: async (id: string): Promise<Chat> => {
    const response = await apiClient.put(`/chat/${id}/archive`);
    return response.data;
  },

  unarchiveChat: async (id: string): Promise<Chat> => {
    const response = await apiClient.put(`/chat/${id}/unarchive`);
    return response.data;
  },

  // Message operations
  getMessages: async ({ chatId, page = 1, limit = 20 }: GetMessagesParams): Promise<Message[]> => {
    const response = await apiClient.get(`/chat/${chatId}/messages`, {
      params: { page, limit },
    });
    return response.data;
  },

  createMessage: async (dto: CreateMessageDto): Promise<Message> => {
    const response = await apiClient.post(`/chat/${dto.chatId}/messages`, dto);
    return response.data;
  },

  updateMessage: async (messageId: string, dto: UpdateMessageDto): Promise<Message> => {
    const response = await apiClient.patch(`/messages/${messageId}`, dto);
    return response.data;
  },

  deleteMessage: async (messageId: string): Promise<void> => {
    await apiClient.delete(`/messages/${messageId}`);
  },
}; 