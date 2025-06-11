"use client";

import Header from '@/widgets/header/ui/header'
import Sidebar from '@/widgets/sidebar/ui/sidebar'
import { SidebarProvider } from '@/widgets/sidebar/model/sidebar-context'
import { useAuthGuard } from '@/shared/hooks/use-auth-guard'

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
 * @returns {JSX.Element} Основной layout приложения
 */
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  useAuthGuard()
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-deep-background text-foreground">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <SidebarProvider>
          <Sidebar />
          <div className="flex-1 overflow-hidden">
            {children}
          </div>
        </SidebarProvider>
      </div>
    </div>
  )
}


export default MainLayout
