import { api } from "@/shared/api/api"
import { PermissionAddPayload } from "../model/permission"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { queryClient } from "@/shared/lib/react-query"
import { useTranslation } from "react-i18next"

const permissionApi = {
  getPermissions: async () => {
    const response = await api.get('/roles-permissions/permissions')
    return response.data
  },
  addPermission: async (userId: string, payload: PermissionAddPayload) => {
    const response = await api.post(`/roles-permissions/users/${userId}/permissions`, payload)
    return response.data
  },
  deletePermission: async (userId: string, permissionId: string) => {
    const response = await api.delete(`/roles-permissions/users/${userId}/permissions/${permissionId}`)
    return response.data
  }
}

export const usePermissionApi = {
  useGetPermissions: () => {
    return useQuery({
      queryKey: ['permissions'],
      queryFn: () => permissionApi.getPermissions()
    })
  },
  useAddPermission: () => {
    const { t } = useTranslation()
    return useMutation({
      mutationFn: ({ userId, payload }: { userId: string, payload: PermissionAddPayload }) => permissionApi.addPermission(userId, payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['permissions'] })
        queryClient.invalidateQueries({ queryKey: ['infiniteUsers'] })
        toast.success(t('toast.permission.added'))
      },
      onError: () => {
        toast.error(t('toast.permission.addError'))
      }
    })  
  },
  useDeletePermission: () => {
    const { t } = useTranslation()
    return useMutation({
      mutationFn: ({ userId, permissionId }: { userId: string, permissionId: string }) => permissionApi.deletePermission(userId, permissionId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['permissions'] })
        queryClient.invalidateQueries({ queryKey: ['infiniteUsers'] })
        toast.success(t('toast.permission.deleted'))
      },
      onError: () => {
        toast.error(t('toast.permission.deleteError'))
      }
    })
  }
}
