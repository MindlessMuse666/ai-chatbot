import { api } from "@/shared/api/api"
import { MessageSendPayload, MessageSearchPayload, Message, MessageResponse } from "../model/message"
import { useMutation, useQuery, useInfiniteQuery } from "@tanstack/react-query"

const messageApi = {
    sendMessage: async (chatId: string, payload: MessageSendPayload) => {
        const response = await api.post(`/chat/${chatId}/messages`, payload)
        return response.data
    },
    searchMessage: async (chatId: string, payload: MessageSearchPayload) => {
        const response = await api.get(`/chat/${chatId}/messages`, { params: payload })
        return response.data
    }
}

export const useMessageApi = {
    useSendMessage: (chatId: string) => {
        return useMutation({
            mutationFn: (payload: MessageSendPayload) => 
                messageApi.sendMessage(chatId, payload)
        })
    },
    useSearchMessage: (chatId: string, payload: MessageSearchPayload) => {
        return useQuery({
            queryKey: ['messages', chatId, payload],
            queryFn: () => messageApi.searchMessage(chatId, payload)
        })
    },
    useInfiniteMessages: (chatId: string, limit: number = 20) => {
        return useInfiniteQuery({
            queryKey: ['infiniteMessages', chatId, limit],
            queryFn: ({ pageParam = 1 }) => {
                const payload: MessageSearchPayload = {
                    offset: (pageParam - 1) * limit,
                    limit
                }
                return messageApi.searchMessage(chatId, payload)
            },
            initialPageParam: 1,
            getNextPageParam: (lastPage, allPages) => {
                if (lastPage.messages.length < limit) {
                    return undefined
                }
                return allPages.length + 1
            }
        })
    }
}


export default messageApi