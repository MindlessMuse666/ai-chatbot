import { api } from "@/shared/api/api"
import { useQuery } from "@tanstack/react-query"

const roleApi = {
    getRoles: async () => {
        const response = await api.get('roles-permissions/roles')
        return response.data
    }
}

export const useRoleApi = {
    useGetRoles: () => {
        return useQuery({
            queryKey: ['roles'],
            queryFn: () => roleApi.getRoles()
        })
    }
}

