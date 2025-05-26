import RoleCard from './role-card'
import { useRoleApi } from '../api/role'
import { Spinner } from '@heroui/react'

const RoleList = () => {
  const { data, isLoading, error } = useRoleApi.useGetRoles()
  return (
    <div className="space-y-4 mx-4">
    {isLoading && <Spinner />}
    {error && <div>{error.message}</div>}
    {data?.map((role: string) => (
        <RoleCard key={role} role={role} />
      ))}
    </div>
  )
}

export default RoleList


