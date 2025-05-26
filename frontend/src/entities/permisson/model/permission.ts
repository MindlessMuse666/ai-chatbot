export interface Permission {
  id: string
  role: string
  permission: string
  active: boolean
}

export interface UserPermission {
  id: string
  limitValue: number | null
  remainder: number | null
  permissionRef: Permission
}

export interface PermissionAddPayload {
  permissionRefId: string
  limitValue: number | null
}


