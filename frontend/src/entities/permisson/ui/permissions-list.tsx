import { Permission } from '../model/permission'
import PermissionCard from './permisson-card'
import { usePermissionApi } from '../api/permission'
import { Spinner } from '@heroui/react'

const PermissionsList = () => {
  const { data, isLoading, error } = usePermissionApi.useGetPermissions()
  return (
    <div className="space-y-4 mx-4">
    {isLoading && <Spinner />}
    {error && <div>{error.message}</div>}
    {data?.map((permission: Permission) => (
        <PermissionCard key={permission.id} permission={permission} />
      ))}
    </div>
  )
}

export default PermissionsList