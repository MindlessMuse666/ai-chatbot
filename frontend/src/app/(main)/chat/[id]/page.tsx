"use client";

import { useParams } from 'next/navigation'
import { ChatBox } from '@/features/chat-box/ui/chat-box'

/**
 * ChatPage — страница детального просмотра чата.
 * 
 * Компонент отображает:
 * - Полноэкранный чат с конкретным собеседником
 * - Интеграцию с Socket.IO для real-time обновлений
 * - Историю сообщений и интерфейс отправки
 * 
 * Особенности:
 * - Динамический роутинг через [id]
 * - Автоматическое подключение к сокету
 * - Адаптивный дизайн с центрированием
 * 
 * @returns {JSX.Element} Страница детального просмотра чата
 */
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