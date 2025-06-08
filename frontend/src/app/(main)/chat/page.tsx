"use client";

import { useChatStore } from '@/entities/chat/model/chat-store'
import Link from 'next/link'
import { useAuthGuard } from '@/shared/hooks/use-auth-guard'
import SidebarFooter from '@/features/sidebar-footer/ui/sidebar-footer'
import { Plus } from 'lucide-react'

/**
 * ChatPage — страница со списком чатов пользователя.
 * Центрирует контент, отображает список чатов или пустое состояние, кнопку создания чата и футер.
 * @module app/(main)/chat/page
 */
const ChatPage = () => {
  useAuthGuard()
  const { chats } = useChatStore()

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-background">
      <main className="flex flex-1 flex-col items-center justify-center w-full">
        <div className="w-full max-w-xl flex flex-col items-center">
          <div className="flex flex-row items-center justify-between w-full mb-8 gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Ваши чаты</h2>
            <Link
              href="#"
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary-foreground text-white font-medium shadow-none hover:bg-primary-foreground/90 transition-colors text-base"
            >
              <Plus className="w-5 h-5" />
              <span>Создать чат</span>
            </Link>
          </div>
          {chats.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center py-24">
              <span className="text-6xl mb-4">💬</span>
              <h3 className="text-xl md:text-2xl font-semibold mb-2 text-foreground">Нет чатов</h3>
              <p className="text-foreground-secondary mb-4">Создайте новый чат, чтобы начать общение с ИИ-ассистентом</p>
              <Link
                href="#"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-foreground text-white font-medium shadow hover:bg-primary-foreground/90 transition-colors text-base"
              >
                <Plus className="w-5 h-5" />
                <span>Создать чат</span>
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col gap-4 w-full">
              {chats.map(chat => (
                <li key={chat.id} className="group bg-primary/70 hover:bg-primary border border-transparent hover:border-primary-foreground rounded-xl px-6 py-5 flex flex-col gap-1 transition-all cursor-pointer">
                  <Link href={`/chat/${chat.id}`} className="text-lg font-semibold text-foreground group-hover:underline truncate">
                    {chat.title}
                  </Link>
                  <div className="flex items-center gap-4 text-xs text-foreground-secondary mt-1">
                    <span>Создан: {new Date(chat.createdAt).toLocaleDateString()}</span>
                    {chat.updatedAt && <span>Обновлён: {new Date(chat.updatedAt).toLocaleDateString()}</span>}
                  </div>
                  {chat.lastMessage && (
                    <div className="mt-1 text-sm text-foreground-secondary truncate">
                      <span className="font-medium">Последнее сообщение:</span> {chat.lastMessage.content}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <SidebarFooter />
    </div>
  )
}


export default ChatPage