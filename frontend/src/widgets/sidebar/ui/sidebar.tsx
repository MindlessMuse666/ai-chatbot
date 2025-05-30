'use client'

import { ChatList } from "@/features/chat-list/ui/chat-list"
import { useState, useEffect } from "react"
import { MessageCircleMore, X } from "lucide-react"
import { Button } from "@heroui/react"
import { useSidebar } from "../model/sidebar-context"

const Sidebar = () => {
  const { isOpen, setIsOpen } = useSidebar()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setIsOpen(true)
      } else {
        setIsOpen(false)
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [setIsOpen])

  return (
    <>
      {isMobile && (
        <Button
          variant="flat"
          isIconOnly
          className="fixed top-24 left-4 z-50 bg-primary-foreground text-background rounded-full shadow-lg"
          onPress={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <MessageCircleMore size={24} />}
        </Button>
      )}
      <div className={`transition-all duration-300 ${
        isMobile ? 
          isOpen ? 'translate-x-0 fixed top-20 left-0 z-40 h-[calc(100vh-5rem)] w-[320px]' : '-translate-x-full fixed' 
          : 'relative w-[320px] h-full'
      }`}>
        <ChatList />
      </div>
    </>
  )
}

export default Sidebar

