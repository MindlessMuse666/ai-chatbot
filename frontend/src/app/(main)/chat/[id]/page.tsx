'use client'

import { useParams } from 'next/navigation'
import { ChatBox } from '@/features/chat-box/ui/chat-box'

const ChatPage = () => {
  const params = useParams<{ id?: string }>()
  const chatId = params?.id ?? ''
  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <ChatBox chatId={chatId} />
    </div>
  )
}

export default ChatPage

