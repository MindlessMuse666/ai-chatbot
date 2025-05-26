'use client'

import { Tabs, Tab } from "@heroui/react";
import UserList from "@/entities/user/ui/user-list";
import PermissionsList from "@/entities/permisson/ui/permissions-list";
import RoleList from "@/entities/role/ui/role-list";

const AdministrationTabs = () => {
  return (
    <Tabs aria-label="Администрирование" className="w-full mt-2" variant='underlined' size='lg'>
      <Tab key="users" title="Пользователи">
        <UserList />
      </Tab>
      <Tab key="roles" title="Роли">
        <RoleList />
      </Tab>
      <Tab key="permissions" title="Разрешения">
        <PermissionsList />
      </Tab>
    </Tabs>
  );
};

export default AdministrationTabs

