import { create } from 'zustand';
import { chatApi } from '../api/chat-api';
import type { Chat, Message, CreateChatDto, UpdateChatDto, CreateMessageDto, UpdateMessageDto } from './types';
import { generateMessages } from '@/mocks/data';
import { MessageSender, MessageType } from './types';
import { useAuthStore } from '@/features/auth/model/auth-store';

interface ChatState {
  chats: Chat[];
  archivedChats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  isAwaitingAssistant: boolean;

  // Chat operations
  fetchChats: () => Promise<void>;
  fetchArchivedChats: () => Promise<void>;
  createChat: (dto: CreateChatDto) => Promise<void>;
  updateChat: (id: string, dto: UpdateChatDto) => Promise<void>;
  deleteChat: (id: string) => Promise<void>;
  hardDeleteChat: (id: string) => Promise<void>;
  archiveChat: (id: string) => Promise<void>;
  unarchiveChat: (id: string) => Promise<void>;
  setCurrentChat: (chat: Chat | null) => void;

  // Message operations
  fetchMessages: (chatId: string, page?: number) => Promise<void>;
  sendMessage: (dto: CreateMessageDto) => Promise<void>;
  updateMessage: (messageId: string, dto: UpdateMessageDto) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;

  // Socket.IO operations
  handleWebSocketMessage: (message: any) => void;
}

const MOCK_CHATS: Chat[] = [
  {
    id: '1',
    title: 'Тестовый чат 1',
    lastMessage: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isArchived: false,
  },
  {
    id: '2',
    title: 'Тестовый чат 2',
    lastMessage: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isArchived: false,
  }
];

function ensureMockChats(state: ChatState): Chat[] {
  if (process.env.NODE_ENV === 'development') {
    // Если мок-чаты отсутствуют (например, после hot reload), возвращаем их
    if (!state.chats || state.chats.length === 0) {
      return [...MOCK_CHATS];
    }
  }
  return state.chats;
}

export const useChatStore = create<ChatState>((set, get) => ({
  chats: process.env.NODE_ENV === 'development' ? [...MOCK_CHATS] : [],
  archivedChats: [],
  currentChat: null,
  messages: [],
  isLoading: false,
  error: null,
  isAwaitingAssistant: false,

  // Chat operations
  fetchChats: async () => {
    set({ isLoading: true, error: null });
    try {
      let chats;
      if (process.env.NODE_ENV === 'development') {
        chats = ensureMockChats(get());
      } else {
        chats = await chatApi.getChats();
      }
      set({ chats, isLoading: false });
    } catch (error) {
      if (useAuthStore.getState().isAuthenticated) {
        set({
          error: error instanceof Error ? error.message : 'Failed to fetch chats',
          isLoading: false
        });
      } else {
        set({ isLoading: false });
      }
    }
  },

  fetchArchivedChats: async () => {
    set({ isLoading: true, error: null });
    try {
      const archivedChats = await chatApi.getArchivedChats();
      set({ archivedChats, isLoading: false });
    } catch (error) {
      if (useAuthStore.getState().isAuthenticated) {
        set({
          error: error instanceof Error ? error.message : 'Failed to fetch archived chats',
          isLoading: false
        });
      } else {
        set({ isLoading: false });
      }
    }
  },

  createChat: async (dto) => {
    set({ isLoading: true, error: null });
    try {
      const newChat = await chatApi.createChat(dto);
      set(state => ({
        chats: [newChat, ...state.chats],
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create chat',
        isLoading: false
      });
    }
  },

  updateChat: async (id, dto) => {
    set({ isLoading: true, error: null });
    try {
      const updatedChat = await chatApi.updateChat(id, dto);
      set(state => ({
        chats: state.chats.map(chat =>
          chat.id === id ? updatedChat : chat
        ),
        currentChat: state.currentChat?.id === id ? updatedChat : state.currentChat,
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update chat',
        isLoading: false
      });
    }
  },

  deleteChat: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await chatApi.deleteChat(id);
      set(state => ({
        chats: state.chats.filter(chat => chat.id !== id),
        currentChat: state.currentChat?.id === id ? null : state.currentChat,
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete chat',
        isLoading: false
      });
    }
  },

  hardDeleteChat: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await chatApi.hardDeleteChat(id);
      set(state => ({
        chats: state.chats.filter(chat => chat.id !== id),
        archivedChats: state.archivedChats.filter(chat => chat.id !== id),
        currentChat: state.currentChat?.id === id ? null : state.currentChat,
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete chat',
        isLoading: false
      });
    }
  },

  archiveChat: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const archivedChat = await chatApi.archiveChat(id);
      set(state => ({
        chats: state.chats.filter(chat => chat.id !== id),
        archivedChats: [archivedChat, ...state.archivedChats],
        currentChat: state.currentChat?.id === id ? null : state.currentChat,
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to archive chat',
        isLoading: false
      });
    }
  },

  unarchiveChat: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const unarchivedChat = await chatApi.unarchiveChat(id);
      set(state => ({
        archivedChats: state.archivedChats.filter(chat => chat.id !== id),
        chats: [unarchivedChat, ...state.chats],
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to unarchive chat',
        isLoading: false
      });
    }
  },

  setCurrentChat: (chat) => {
    set({ currentChat: chat });
  },

  // Message operations
  fetchMessages: async (chatId, page = 1) => {
    set({ isLoading: true, error: null });
    try {
      let messages: Message[];
      if (process.env.NODE_ENV === 'development') {
        // Для тестовых чатов всегда генерируем 20 Faker-JS сообщений
        if (chatId === '1' || chatId === '2') {
          messages = generateMessages(chatId, 20)
            .map((msg) => ({
              id: msg.id,
              chatId: msg.chatId,
              content: msg.versions[0]?.content || '',
              type: msg.versions[0]?.type || MessageType.TEXT,
              createdAt: msg.versions[0]?.createdAt || new Date().toISOString(),
              updatedAt: msg.versions[0]?.createdAt || new Date().toISOString(),
              isEdited: false,
              sender: msg.role,
            }))
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        } else {
          // Для новых чатов — пусто
          messages = [];
        }
      } else {
        messages = await chatApi.getMessages({ chatId, page });
      }
      set(state => ({
        messages: page === 1 ? messages : [...state.messages, ...messages],
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch messages',
        isLoading: false
      });
    }
  },

  sendMessage: async (dto) => {
    if (process.env.NODE_ENV === 'development') {
      // Мгновенно добавляем сообщение пользователя
      const userMessage = {
        id: String(Date.now()),
        chatId: dto.chatId,
        content: dto.content,
        type: dto.type,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isEdited: false,
        sender: MessageSender.USER,
      };
      set(state => ({
        messages: [...state.messages, userMessage],
        chats: state.chats.map(chat =>
          chat.id === dto.chatId ? { ...chat, lastMessage: userMessage } : chat
        ),
        isLoading: false,
        isAwaitingAssistant: true,
      }));
      // Через 1.5 сек — ответ ассистента
      setTimeout(() => {
        const assistantMessage = {
          id: String(Date.now() + 1),
          chatId: dto.chatId,
          content: 'Это ответ ассистента (мок).',
          type: MessageType.TEXT,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isEdited: false,
          sender: MessageSender.AI,
        };
        set(state => ({
          messages: [...state.messages, assistantMessage],
          chats: state.chats.map(chat =>
            chat.id === dto.chatId ? { ...chat, lastMessage: assistantMessage } : chat
          ),
          isAwaitingAssistant: false,
        }));
      }, 1500);
      return;
    }
    // ... production/real API ...
    set({ isLoading: true, error: null, isAwaitingAssistant: true });
    try {
      const message = await chatApi.createMessage(dto);
      set(state => ({
        messages: [...state.messages, message],
        chats: state.chats.map(chat =>
          chat.id === dto.chatId
            ? { ...chat, lastMessage: message }
            : chat
        ),
        isLoading: false
      }));
      // Ждём появления ответа ассистента (через 1.5 сек)
      setTimeout(() => {
        set({ isAwaitingAssistant: false });
      }, 1600);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to send message',
        isLoading: false,
        isAwaitingAssistant: false
      });
    }
  },

  updateMessage: async (messageId, dto) => {
    set({ isLoading: true, error: null });
    try {
      const updatedMessage = await chatApi.updateMessage(messageId, dto);
      set(state => ({
        messages: state.messages.map(message =>
          message.id === messageId ? updatedMessage : message
        ),
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update message',
        isLoading: false
      });
    }
  },

  deleteMessage: async (messageId) => {
    set({ isLoading: true, error: null });
    try {
      await chatApi.deleteMessage(messageId);
      set(state => ({
        messages: state.messages.filter(message => message.id !== messageId),
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete message',
        isLoading: false
      });
    }
  },

  // Socket.IO operations
  handleWebSocketMessage: (message) => {
    switch (message.type) {
      case 'message':
        const newMessage = message.payload as Message;
        set(state => ({
          messages: [...state.messages, newMessage],
          chats: state.chats.map(chat =>
            chat.id === newMessage.chatId
              ? { ...chat, lastMessage: newMessage }
              : chat
          ),
        }));

        // Имитируем ответ ассистента через 1.5 секунды
        if (newMessage.sender === MessageSender.USER) {
          setTimeout(() => {
            const assistantMessage: Message = {
              id: String(Date.now()),
              chatId: newMessage.chatId,
              content: 'Это автоматический ответ ассистента',
              type: MessageType.TEXT,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              isEdited: false,
              sender: MessageSender.AI,
            };

            set(state => ({
              messages: [...state.messages, assistantMessage],
              chats: state.chats.map(chat =>
                chat.id === assistantMessage.chatId
                  ? { ...chat, lastMessage: assistantMessage }
                  : chat
              ),
            }));
          }, 1500);
        }
        break;

      case 'chat_update':
        const updatedChat = message.payload as Chat;
        set(state => ({
          chats: state.chats.map(chat =>
            chat.id === updatedChat.id ? updatedChat : chat
          ),
          currentChat: state.currentChat?.id === updatedChat.id
            ? updatedChat
            : state.currentChat,
        }));
        break;

      case 'error':
        console.error('WebSocket error:', message.payload);
        break;
    }
  },
})); 