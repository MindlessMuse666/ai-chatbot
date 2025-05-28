import { api } from "@/shared/api/api"
import { Chat } from "../model/chat"
import { useQuery, useMutation } from "@tanstack/react-query"
import { queryClient } from "@/shared/lib/react-query"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"

const chatApi = {
  getChats: async (): Promise<Chat[]> => {
    const response = await api.get('/api/v1.0/chats')
    return response.data
  },
  createChat: async (data: { title: string }): Promise<Chat> => {
    const response = await api.post('/api/v1.0/chats', data)
    return response.data
  },
  changeChatTitle: async (id: string, data: { title: string }): Promise<Chat> => {
    const response = await api.put(`/api/v1.0/chats/${id}`, data)
    return response.data
  },
  deleteChat: async (data: { id: string }): Promise<void> => {
    const response = await api.delete(`/api/v1.0/chats/${data.id}`)
    return response.data
  }
}

export const useChatApi = {
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
  }
}

export default chatApi