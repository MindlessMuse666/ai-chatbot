'use client'

import { useChatStore } from '@/entities/chat/model/chat-store'
import Link from 'next/link'

const ChatPage = () => {
  const { chats } = useChatStore()
  console.log('MOCK CHATS:', useChatStore.getState().chats)
  // console.log('ChatPage rendered', chats)
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