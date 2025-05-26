import { UserPermission } from "@/entities/permisson/model/permission"
import { Role } from "@/entities/role/model/role"

export interface User {
    id: string
    email: string
    name: string
    status: UserStatus
    role: Role
    userPermissions: UserPermission[]
    createdAt: Date
}

export interface UserList {
    users: User[]
    total: number
}

export interface UserListPayload {
    offset: number
    limit: number
}

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    DELETED = 'DELETED',
    BLOCKED = 'BLOCKED',
}
