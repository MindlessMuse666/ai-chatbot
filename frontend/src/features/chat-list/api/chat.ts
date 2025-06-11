/**
 * API-клиент для работы с чатами.
 * Предоставляет методы для CRUD операций и управления состоянием чатов.
 */

import { api } from "@/shared/api/api"
import { Chat } from "../model/chat"
import { useQuery, useMutation } from "@tanstack/react-query"
import { queryClient } from "@/shared/lib/react-query"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"

/**
 * Базовые API методы для работы с чатами
 */
const chatApi = {
  /**
   * Получение списка чатов
   * @returns {Promise<Chat[]>} Список чатов
   */
  getChats: async (): Promise<Chat[]> => {
    const response = await api.get('/chat')
    return response.data
  },

  /**
   * Создание нового чата
   * @param data - данные для создания чата
   * @returns {Promise<Chat>} Созданный чат
   */
  createChat: async (data: { title: string }): Promise<Chat> => {
    const response = await api.post('/chat', data)
    return response.data
  },

  /**
   * Изменение заголовка чата
   * @param id - идентификатор чата
   * @param data - новые данные чата
   * @returns {Promise<Chat>} Обновленный чат
   */
  changeChatTitle: async (id: string, data: { title: string }): Promise<Chat> => {
    const response = await api.put(`/chat/${id}`, data)
    return response.data
  },

  /**
   * Удаление чата
   * @param data - данные для удаления
   * @returns {Promise<void>}
   */
  deleteChat: async (data: { id: string }): Promise<void> => {
    const response = await api.delete(`/chat/${data.id}`)
    return response.data
  },

  /**
   * Архивация чата
   * @param id - идентификатор чата
   * @returns {Promise<Chat>} Архивированный чат
   */
  archiveChat: async (id: string): Promise<Chat> => {
    const response = await api.put(`/chat/${id}/archive`)
    return response.data
  },

  /**
   * Разархивация чата
   * @param id - идентификатор чата
   * @returns {Promise<Chat>} Разархивированный чат
   */
  unarchiveChat: async (id: string): Promise<Chat> => {
    const response = await api.put(`/chat/${id}/unarchive`)
    return response.data
  }
}

/**
 * React Query хуки для работы с чатами
 */
export const useChatApi = {
  /**
   * Хук для получения списка чатов
   */
  useGetChats: () => {
    const { t } = useTranslation()
    return useQuery({
      queryKey: ['chats'],
      queryFn: chatApi.getChats,
      meta: {
        onError: () => {
          toast.error(t('errors.network'))
        }
      }
    })
  },

  /**
   * Хук для создания нового чата
   */
  useCreateChat: () => {
    const { t } = useTranslation()
    return useMutation({
      mutationFn: (title: string) => 
        chatApi.createChat({ title }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['chat'] })
        toast.success(t('chat.toast.created'))
      },
      onError: (error: any) => {
        const statusCode = error.response?.status || error
        if (statusCode === 403) {
          toast.error(t('toast.chat.chatLimitExceeded'))
        } else {
          toast.error(t('toast.chat.createError'), {
            description: error.message
          })
        }
      }
    })
  },

  /**
   * Хук для изменения заголовка чата
   */
  useChangeChatTitle: () => {
    const { t } = useTranslation()
    return useMutation({
      mutationFn: ({ chatId, title }: { chatId: string, title: string }) => 
        chatApi.changeChatTitle(chatId, { title }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['chat'] })
        toast.success(t('chat.toast.renamed'))
      },
      onError: () => {
        toast.error(t('chat.toast.error'))
      }
    })
  },

  /**
   * Хук для удаления чата
   */
  useDeleteChat: () => {
    const { t } = useTranslation()
    return useMutation({
      mutationFn: (chatId: string) => chatApi.deleteChat({ id: chatId }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['chat'] })
        toast.success(t('chat.toast.deleted'))
      },
      onError: () => {
        toast.error(t('chat.toast.error'))
      }
    })
  },

  /**
   * Хук для архивации чата
   */
  useArchiveChat: () => {
    const { t } = useTranslation()
    return useMutation({
      mutationFn: (chatId: string) => chatApi.archiveChat(chatId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['chat'] })
        toast.success(t('chat.toast.archived'))
      },
      onError: () => {
        toast.error(t('chat.toast.error'))
      }
    })
  },

  /**
   * Хук для разархивации чата
   */
  useUnarchiveChat: () => {
    const { t } = useTranslation()
    return useMutation({
      mutationFn: (chatId: string) => chatApi.unarchiveChat(chatId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['chat'] })
        toast.success(t('chat.toast.unarchived'))
      },
      onError: () => {
        toast.error(t('chat.toast.error'))
      }
    })
  }
}

export default chatApi