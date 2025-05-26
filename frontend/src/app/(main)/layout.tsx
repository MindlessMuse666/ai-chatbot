'use client'

import Header from '@/widgets/header/ui/header'
import Sidebar from '@/widgets/sidebar/ui/sidebar'
import { SidebarProvider } from '@/widgets/sidebar/model/sidebar-context'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
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
