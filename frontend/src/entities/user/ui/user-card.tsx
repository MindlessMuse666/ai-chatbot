'use client'

import { User, UserStatus } from '../model/user'
import { Role } from '@/entities/role/model/role'
import { useUserApi } from '../api/user'
import { usePermissionApi } from '@/entities/permisson/api/permission'
import { Button, Card, Popover, PopoverTrigger, PopoverContent, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Checkbox, Input } from '@heroui/react'
import { Ban, Trash2, UnlockKeyhole, EllipsisVertical, Shield } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { Permission } from '@/entities/permisson/model/permission'

interface SelectedPermission {
  id: string
  limitValue: number | null
}

const CardPopover = ({ user }: { user: User }) => {
  const { t } = useTranslation()
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false)
  const { mutate: blockUser } = useUserApi.useBlockUser()
  const { mutate: unblockUser } = useUserApi.useUnblockUser()
  const { mutate: deleteUser } = useUserApi.useDeleteUser()
  const { data: permissions, isLoading: isPermissionsLoading } = usePermissionApi.useGetPermissions()
  const { mutate: addPermission } = usePermissionApi.useAddPermission()
  const { mutate: deletePermission } = usePermissionApi.useDeletePermission()
  const [selectedPermissions, setSelectedPermissions] = useState<Record<string, SelectedPermission>>({})
  
  const handleBlock = () => {
    setIsPopoverOpen(false)
    blockUser(user.id)
  }

  const handleUnblock = () => {
    setIsPopoverOpen(false)
    unblockUser(user.id)
  }

  const handleDelete = () => {
    setIsPopoverOpen(false)
    deleteUser(user.id)
  }

  const handlePermissionsOpen = () => {
    setIsPopoverOpen(false)
    setIsPermissionsModalOpen(true)
    
    const initial: Record<string, SelectedPermission> = {}
    user.userPermissions?.forEach(p => {
      initial[p.permissionRef.id] = {
        id: p.id,
        limitValue: p.limitValue === null ? null : p.limitValue
      }
    })
    setSelectedPermissions(initial)
  }

  const handlePermissionToggle = (permission: Permission, checked: boolean) => {
    setSelectedPermissions(prev => {
      const next = { ...prev }
      if (checked) {
        const existingPermission = user.userPermissions?.find(p => p.permissionRef.id === permission.id)
        next[permission.id] = {
          id: existingPermission?.id || '',
          limitValue: existingPermission?.limitValue === null ? null : (existingPermission?.limitValue || 0)
        }
      } else {
        delete next[permission.id]
      }
      return next
    })
  }

  const handleLimitValueChange = (permission: Permission, value: string) => {
    const limitValue = value === '' ? null : (parseInt(value) || 0)
    setSelectedPermissions(prev => ({
      ...prev,
      [permission.id]: {
        ...prev[permission.id],
        limitValue
      }
    }))
  }

  const handleSave = () => {

    Object.entries(selectedPermissions).forEach(([permissionId, selected]) => {
      const existingPermission = user.userPermissions?.find(p => p.permissionRef.id === permissionId)
      if (!existingPermission) {
        addPermission({
          userId: user.id,
          payload: {
            permissionRefId: permissionId,
            limitValue: selected.limitValue
          }
        })
      } else if (existingPermission.limitValue !== selected.limitValue) {
        addPermission({
          userId: user.id,
          payload: {
            permissionRefId: permissionId,
            limitValue: selected.limitValue
          }
        })
      }
    })

    user.userPermissions?.forEach(existingPermission => {
      if (!(existingPermission.permissionRef.id in selectedPermissions)) {
        deletePermission({
          userId: user.id,
          permissionId: existingPermission.permissionRef.id
        })
      }
    })

    setIsPermissionsModalOpen(false)
  }

  const isPermissionSelected = (permission: Permission) => {
    return permission.id in selectedPermissions
  }

  return (
    <>
      <Popover placement="bottom-end" isOpen={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="light" size="sm" isIconOnly>
            <EllipsisVertical className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Button 
            variant="light" 
            className="w-full" 
            size="sm" 
            startContent={<Shield className="w-4 h-4" />} 
            onPress={handlePermissionsOpen}
          >
            <p>{t('permission.edit')}</p>
          </Button>
          {user.status === UserStatus.ACTIVE ? (
            <Button 
              variant="light" 
              className="w-full" 
              size="sm" 
              startContent={<Ban className="w-4 h-4" />} 
              onPress={handleBlock}
            >
              <p>{t('user.block')}</p>
            </Button>
          ) : user.status === UserStatus.BLOCKED ? (
            <Button 
              variant="light" 
              className="w-full" 
              size="sm" 
              startContent={<UnlockKeyhole className="w-4 h-4" />} 
              onPress={handleUnblock}
            >
              <p>{t('user.unblock')}</p>
            </Button>
          ) : null}
          <Button 
            variant="light" 
            className="w-full" 
            size="sm" 
            startContent={<Trash2 className="w-4 h-4" />} 
            onPress={handleDelete}
          >
            <p>{t('user.delete')}</p>
          </Button>
        </PopoverContent>
      </Popover>

      <Modal isOpen={isPermissionsModalOpen} onClose={() => setIsPermissionsModalOpen(false)}>
        <ModalContent>
          <ModalHeader>{t('permission.title')}</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              {isPermissionsLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : permissions?.map((permission: Permission) => (
                <div key={permission.id} className="flex flex-col gap-2">
                  <Checkbox
                    isSelected={isPermissionSelected(permission)}
                    onValueChange={(checked) => handlePermissionToggle(permission, checked)}
                  >
                    <div>
                      <p className="font-medium">{permission.role}</p>
                      <p className="text-sm text-default-500">{permission.permission}</p>
                    </div>
                  </Checkbox>
                  {isPermissionSelected(permission) && selectedPermissions[permission.id] && (
                    <Input
                      type="number"
                      min={0}
                      size="sm"
                      label={t('permission.limitValue')}
                      value={selectedPermissions[permission.id].limitValue?.toString() || ''}
                      onChange={(e) => handleLimitValueChange(permission, e.target.value)}
                      className="max-w-[200px] ml-6"
                      placeholder={t('permission.noLimit')}
                    />
                  )}
                </div>
              ))}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setIsPermissionsModalOpen(false)}>
              {t('button.cancel')}
            </Button>
            <Button color="primary" onPress={handleSave}>
              {t('button.save')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

interface UserCardProps {
  user: User
}

export const UserCard = ({ user }: UserCardProps) => {
  return (
    <Card className="w-full p-4">
      <div className="flex items-center gap-4">
        <span className={`
          px-2 py-0.5 rounded-full text-xs shrink-0
          ${user.status === UserStatus.ACTIVE ? 'bg-green-200 text-green-800' : ''}
          ${user.status === UserStatus.BLOCKED ? 'bg-red-200 text-red-800' : ''}
          ${user.status === UserStatus.DELETED ? 'bg-gray-200 text-gray-800' : ''}
        `}>
          {user.status}
        </span>
        <span className={`
          px-2 py-0.5 rounded-full text-xs shrink-0
          ${user.role === Role.ADMIN ? 'bg-purple-200 text-purple-800' : 'bg-blue-200 text-blue-800'}
        `}>
          {user.role}
        </span>
        <div className="flex-grow">
          <h3 className="text-lg font-medium">{user.name}</h3>
          <p className="text-sm text-default-500">{user.email}</p>
        </div>
        <CardPopover user={user} />
      </div>
    </Card>
  )
}

