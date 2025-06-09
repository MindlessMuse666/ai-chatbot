"use client";

import { FC, useState, useEffect, useCallback } from "react"
import { ChatList } from "@/features/chat-list/ui/chat-list"
import { MessageCircleMore, X } from "lucide-react"
import { Button } from "@heroui/react"
import { useSidebar } from "../model/sidebar-context"
import CreateChatButton from "@/features/chat-list/ui/create-chat-button"

const buttonHoverEffect = "hover:scale-110 hover:shadow-lg hover:shadow-primary-foreground/30 hover:bg-primary-foreground/90 focus:ring-2 focus:ring-primary-foreground transition-all duration-200";

/**
 * SidebarToggleButton — компонент кнопки скрытия/открытия панели.
 * @param isOpen — текущее состояние панели
 * @param onClick — обработчик нажатия на кнопку
 * @param tooltipRight — флаг, указывающий, должна ли кнопка открытия панели быть сдвинута вправо
 */
const SidebarToggleButton: FC<{isOpen: boolean, onClick: () => void, tooltipRight?: boolean}> = ({ isOpen, onClick, tooltipRight }) => (
  <div className={`relative group flex items-center justify-center overflow-visible ${tooltipRight ? 'mt-6' : ''}`}>
    <Button
      variant="flat"
      isIconOnly
      className={`w-12 h-12 bg-primary-foreground text-white rounded-2xl shadow border-2 border-transparent group-hover:border-primary-foreground group-focus:border-primary-foreground ${buttonHoverEffect} flex items-center justify-center`}
      onPress={onClick}
      aria-label={isOpen ? "Скрыть панель" : "Открыть панель"}
    >
      {isOpen ? <X size={24} className="text-white w-6 h-6" /> : <MessageCircleMore size={24} className="text-white w-6 h-6" />}
    </Button>
    <span className={tooltipRight
      ? "absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1 rounded bg-background text-xs text-foreground opacity-0 group-hover:opacity-100 group-focus:opacity-100 pointer-events-none shadow transition-all duration-200 whitespace-nowrap z-50 min-w-max"
      : "absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 rounded bg-background text-xs text-foreground opacity-0 group-hover:opacity-100 group-focus:opacity-100 pointer-events-none shadow transition-all duration-200 whitespace-nowrap z-50 min-w-max"
    }>
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
      <div className="relative min-h-full w-20 flex flex-col items-center justify-start bg-background border-r border-primary pt-6">
        <SidebarToggleButton isOpen={false} onClick={() => setIsOpen(true)} tooltipRight />
      </div>
    )
  }

  return (
    <div
      className={`transition-transform duration-300 bg-background border-r border-primary h-full flex flex-col w-[320px]`}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-primary/30">
        <span className="text-lg font-bold text-foreground select-none">Чаты</span>
        <SidebarToggleButton isOpen={true} onClick={() => setIsOpen(false)} />
      </div>
      <div className="px-4 py-6 border-b border-primary/30 flex justify-center">
        <div className="w-full max-w-xs flex justify-center">
          <CreateChatButton className="w-full py-0" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-2">
        <ChatList hideHeader hideCreateButton />
      </div>
    </div>
  )
}


export default Sidebar