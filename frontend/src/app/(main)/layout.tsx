"use client";

import Header from '@/features/header/ui/header'
import Sidebar from '@/features/sidebar/ui/sidebar'
import { SidebarProvider } from '@/features/sidebar/model/sidebar-context'
import { useAuthGuard } from '@/shared/hooks/use-auth-guard'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

/**
 * MainLayout — основной layout приложения для защищённых страниц.
 * 
 * Компонент обеспечивает:
 * - Защиту роутов через useAuthGuard
 * - Общую структуру с header и sidebar
 * - Контекст для управления состоянием sidebar
 * - Адаптивную верстку с flexbox
 * 
 * @param {Object} props - Свойства компонента
 * @param {React.ReactNode} props.children - Дочерние компоненты для рендеринга
 * @module app/(main)/layout
 * @returns {JSX.Element} Основной layout приложения
 */
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  useAuthGuard()
  const pathname = usePathname()
  
  // Sidebar только если не /chat
  const isChatListPage = useMemo(() => pathname === '/chat', [pathname])

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-deep-background text-foreground">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <SidebarProvider>
          {(!isChatListPage) && <Sidebar />}
          <div className="flex-1 overflow-hidden">
            {children}
          </div>
        </SidebarProvider>
      </div>
    </div>
  )
}


export default MainLayout