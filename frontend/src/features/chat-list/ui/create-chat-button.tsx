"use client";

import React from 'react'
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
}

export const CreateChatButton = ({ variant = 'default' }: CreateChatButtonProps) => {
  const { t } = useTranslation()
  const { mutate: createChat, isPending } = useChatApi.useCreateChat()
  const { setIsOpen } = useSidebar()
  const router = useRouter()
  const { createChat: createChatStore, chats } = useChatStore()
  
  const handleCreateChat = async () => {
    try {
      await createChatStore({})
      if (chats.length > 0) {
        router.push(`/chat/${chats[0].id}`)
        toast.success('New chat created')
      }
    } catch (error) {
      toast.error('Failed to create chat')
    }
  }

  return (
    <Button 
      variant={variant} 
      size="sm" 
      className="gap-2" 
      startContent={!isPending && <Plus className="h-4 w-4" />}
      onPress={handleCreateChat}
      isLoading={isPending}
    >
      {t('button.createChat')}
    </Button>
  )
}


export default CreateChatButton