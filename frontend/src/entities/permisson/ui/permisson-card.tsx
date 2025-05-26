import { Card } from '@heroui/react'
import { Permission } from '../model/permission'

interface PermissionCardProps {
  permission: Permission
}   

const PermissionCard = ({ permission }: PermissionCardProps) => {
  return (
    <Card className="w-full p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="">{permission.role}</h3>
          <p className="text-md font-semibold">Разрешение: {permission.permission}</p>
          <span className="inline-block bg-primary rounded px-2 py-1 text-sm mt-2">
            {permission.active ? 'Активно' : 'Не активно'}
          </span>
        </div>
      </div>
    </Card>
  )
}

export default PermissionCard