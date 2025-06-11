"use client";

import { useChatStore } from '@/entities/chat/model/chat-store'
import Link from 'next/link'
import { useAuthGuard } from '@/shared/hooks/use-auth-guard'

/**
 * ChatPage — страница со списком чатов пользователя.
 * 
 * Компонент отображает:
 * - Список всех доступных чатов
 * - Ссылки для перехода в конкретный чат
 * - Сообщение при отсутствии чатов
 * 
 * Использует:
 * - useAuthGuard для защиты роута
 * - useChatStore для получения списка чатов
 * 
 * @returns {JSX.Element} Страница со списком чатов
 */
const ChatPage = () => {
  useAuthGuard()
  const { chats } = useChatStore()
  return (
    <div>
      <h2>Ваши чаты</h2>
      {chats.length === 0 ? (
        <p>Нет чатов</p>
      ) : (
        <ul>
          {chats.map(chat => (
            <li key={chat.id}>
              <Link href={`/chat/${chat.id}`}>{chat.title}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}


export default ChatPage