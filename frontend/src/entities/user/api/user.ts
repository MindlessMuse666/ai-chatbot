import { api } from "@/shared/api/api"
import { User, UserList, UserListPayload } from "../model/user"
import { useMutation, useQuery, useInfiniteQuery } from "@tanstack/react-query"
import { queryClient } from "@/shared/lib/react-query"
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'

const userApi = {
  getMe: async () => {
    const response = await api.get<User>('/user/profile')
    return response.data
  },
  getUsers: async (payload: UserListPayload) => {
    const response = await api.get<UserList>('/users', { params: payload })
    return response.data
  },
  blockUser: async (id: string) => {
    const response = await api.post(`users/${id}/block`)
    return response.data
  },
  unblockUser: async (id: string) => {
    const response = await api.post(`users/${id}/unblock`)
    return response.data  
  },
  deleteUser: async (id: string) => {
    const response = await api.delete(`users/${id}`)
    return response.data
  }
}

export const useUserApi = {
  useMe: () => {
    return useQuery({
      queryKey: ['user', 'me'],
      queryFn: () => userApi.getMe()
    })
  },
  useUsers: (payload: UserListPayload) => {
    return useQuery({
      queryKey: ['users', payload],
      queryFn: () => userApi.getUsers(payload)
    })
  },
  useInfiniteUsers: (limit: number = 20) => {
    return useInfiniteQuery({
      queryKey: ['infiniteUsers', limit],
      queryFn: ({ pageParam = 1 }) => {
        const payload: UserListPayload = {
          offset: (pageParam - 1) * limit,
          limit
        }
        return userApi.getUsers(payload)
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.users.length < limit) {
          return undefined
        }
        return allPages.length + 1
      }
    })
  },
  useBlockUser: () => {
    const { t } = useTranslation()
    return useMutation({
      mutationFn: (id: string) => userApi.blockUser(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['infiniteUsers'] })
        toast.success(t('toast.user.blocked'))
      },
      onError: () => {
        toast.error(t('toast.user.blockError'))
      }
    })
  },
  useUnblockUser: () => {
    const { t } = useTranslation()
    return useMutation({
      mutationFn: (id: string) => userApi.unblockUser(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['infiniteUsers'] })
        toast.success(t('toast.user.unblocked'))
      },
      onError: () => {
        toast.error(t('toast.user.unblockError'))
      }
    })
  },
  useDeleteUser: () => {
    const { t } = useTranslation()
    return useMutation({
      mutationFn: (id: string) => userApi.deleteUser(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['infiniteUsers'] })
        toast.success(t('toast.user.deleted'))
      },
      onError: () => {
        toast.error(t('toast.user.deleteError'))
      }
    })
  }
}

export default userApi