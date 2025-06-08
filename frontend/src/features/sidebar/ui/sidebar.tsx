"use client";

import { FC, useState, useEffect } from "react"
import { ChatList } from "@/features/chat-list/ui/chat-list"
import { MessageCircleMore, X } from "lucide-react"
import { Button } from "@heroui/react"
import { useSidebar } from "../model/sidebar-context"
import CreateChatButton from "@/features/chat-list/ui/create-chat-button"

/**
 * SidebarToggleButton — компонент кнопки скрытия/открытия панели.
 * @param isOpen — текущее состояние панели
 * @param onClick — обработчик нажатия на кнопку
 */
const SidebarToggleButton: FC<{isOpen: boolean, onClick: () => void}> = ({ isOpen, onClick }) => (
  <div className="relative group">
    <Button
      variant="flat"
      isIconOnly
      className={`ml-auto bg-primary-foreground text-background rounded-full shadow transition-all border-2 border-transparent group-hover:border-primary-foreground group-focus:border-primary-foreground duration-200`}
      onPress={onClick}
      aria-label={isOpen ? "Скрыть панель" : "Открыть панель"}
    >
      {isOpen ? <X size={24} /> : <MessageCircleMore size={24} />}
    </Button>
    <span className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-background text-xs text-foreground opacity-0 group-hover:opacity-100 group-focus:opacity-100 pointer-events-none shadow transition-all duration-200 whitespace-nowrap z-50">
      {isOpen ? "Скрыть панель" : "Открыть панель"}
    </span>
  </div>
)

/**
 * Sidebar — боковая панель со списком чатов.
 * Содержит header, кнопку скрытия/открытия, кнопку создания чата, анимацию перехода между состояниями.
 * @module features/sidebar/ui/sidebar
 */
const Sidebar: FC = () => {
  const { isOpen, setIsOpen } = useSidebar()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsOpen(window.innerWidth >= 768)
    }
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [setIsOpen])

  // Скрытый вид сайдбара
  if (!isOpen) {
    return (
      <div className="fixed top-20 left-0 z-40 h-[calc(100vh-5rem)] flex flex-col items-center justify-start w-14 bg-background border-r border-primary transition-transform duration-300">
        <SidebarToggleButton isOpen={false} onClick={() => setIsOpen(true)} />
      </div>
    )
  }

  return (
    <div
      className={`transition-transform duration-300 bg-background border-r border-primary h-full flex flex-col w-[320px]`}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-primary/40">
        <span className="text-lg font-bold text-foreground select-none">Чаты</span>
        <SidebarToggleButton isOpen={true} onClick={() => setIsOpen(false)} />
      </div>
      <div className="px-4 py-3 border-b border-primary/30">
        <CreateChatButton />
      </div>
      <div className="flex-1 overflow-y-auto">
        <ChatList hideHeader hideCreateButton />
      </div>
    </div>
  )
}


export default Sidebar