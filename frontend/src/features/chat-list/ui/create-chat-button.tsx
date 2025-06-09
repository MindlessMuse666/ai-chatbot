"use client";

import React, { FC } from 'react'
import { Button } from "@heroui/react"
import { Plus } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useChatApi } from "../api/chat"
import { useSidebar } from "@/features/sidebar/model/sidebar-context"
import { useRouter } from "next/navigation"
import { toast } from 'sonner'
import { useChatStore } from '@/entities/chat/model/chat-store'

interface CreateChatButtonProps {
  variant?: 'default' | 'outline'
  className?: string
}

/**
 * CreateChatButton — кнопка создания нового чата.
 * Современный стиль, плавная анимация, обработка загрузки.
 * @param variant — стиль кнопки ('default' | 'outline')
 * @param className — дополнительные классы
 * @module features/chat-list/ui/create-chat-button
 */
export const CreateChatButton: FC<CreateChatButtonProps> = ({ variant = 'default', className = '' }) => {
  const { t } = useTranslation()
  const { mutate: createChat, isPending } = useChatApi.useCreateChat()
  const { setIsOpen } = useSidebar()
  const router = useRouter()
  const { createChat: createChatStore, chats } = useChatStore()
  
  /**
   * Обработчик создания нового чата: создаёт чат и редиректит на него.
   */
  const handleCreateChat = async () => {
    try {
      await createChatStore({})
      if (chats.length > 0) {
        router.push(`/chat/${chats[0].id}`)
        toast.success('Новый чат создан')
      }
    } catch (error) {
      toast.error('Ошибка при создании чата')
    }
  }

  return (
    <Button 
      variant={variant} 
      size="sm" 
      className={`gap-2 rounded-2xl bg-primary-foreground text-white h-14 py-0 text-lg shadow border-2 border-transparent hover:border-primary-foreground focus:ring-2 focus:ring-primary-foreground hover:bg-primary-foreground-90 dark:hover:bg-primary-foreground-90 hover:scale-105 hover:shadow-lg hover:shadow-primary-foreground/30 transition-all will-change-transform w-[220px] flex flex-row items-center justify-center ${className}`}
      startContent={!isPending && <Plus className="h-6 w-6" />}
      onPress={handleCreateChat}
      isLoading={isPending}
    >
      {t('button.createChat')}
    </Button>
  )
}


export default CreateChatButton