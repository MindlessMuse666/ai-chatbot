"use client";

import { createContext, useContext, useState, ReactNode, FC } from 'react'

/**
 * SidebarContextType — тип состояния Sidebar.
 * @property isOpen — открыт ли сайдбар
 * @property setIsOpen — функция для изменения состояния
 */
export interface SidebarContextType {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

/**
 * SidebarProvider — провайдер состояния Sidebar.
 * Оборачивает приложение и предоставляет состояние открытия/закрытия сайдбара.
 * @param children — дочерние элементы
 */
export const SidebarProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

/**
 * useSidebar — хук для доступа к состоянию Sidebar.
 * @throws если используется вне SidebarProvider
 */
export function useSidebar(): SidebarContextType {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar должен использоваться внутри SidebarProvider')
  }
  return context
}