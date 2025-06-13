"use client";

import { FC, useCallback } from 'react'
import { useChatStore } from '@/entities/chat/model/chat-store'
import { useAuthGuard } from '@/shared/hooks/use-auth-guard'
import SidebarFooter from '@/features/sidebar-footer/ui/sidebar-footer'
import CreateChatButton from '@/features/chat-list/ui/create-chat-button'
import { useRouter } from 'next/navigation'

/**
 * ChatPage — страница со списком чатов пользователя.
 * Центрирует контент, отображает список чатов или пустое состояние, кнопку создания чата и футер.
 * @module app/(main)/chat/page
 */
const ChatPage: FC = () => {
  useAuthGuard()
  const { chats, setCurrentChat } = useChatStore()
  const router = useRouter()

  /**
   * Обработчик выбора чата: устанавливает текущий чат и редиректит на него.
   * @param chatId — идентификатор выбранного чата
   */
  const handleChatSelect = useCallback((chatId: string) => {
    const chat = chats.find(c => c.id === chatId)
    if (chat) {
      setCurrentChat(chat)
      router.push(`/chat/${chatId}`)
    }
  }, [chats, setCurrentChat, router])

  const isEmpty = chats.length === 0

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-background">
      <main className="flex flex-1 flex-col items-center justify-center w-full">
        <div className="w-full max-w-xl flex flex-col items-center">
          <div className="w-full max-w-lg mx-auto bg-primary/40 border border-primary/30 rounded-2xl shadow-lg p-8 flex flex-col items-center gap-8">
            <div className="flex flex-row items-center justify-between w-full gap-4">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Ваши чаты</h2>
              <CreateChatButton />
            </div>
            {isEmpty ? (
              <div className="flex flex-1 flex-col items-center justify-center text-center py-16 w-full">
                <span className="text-6xl mb-4">💬</span>
                <h3 className="text-xl md:text-2xl font-semibold mb-2 text-foreground">Нет чатов</h3>
                <p className="text-foreground-secondary mb-4">Создайте новый чат, чтобы начать общение с ИИ-ассистентом</p>
                <CreateChatButton />
              </div>
            ) : (
              <ul className="flex flex-col gap-4 w-full">
                {chats.map(chat => (
                  <li
                    key={chat.id}
                    className={
                      `group bg-primary/70 hover:bg-primary border border-transparent hover:border-primary-foreground rounded-xl px-6 py-5 flex flex-col gap-1 transition-all cursor-pointer`
                    }
                    onClick={() => handleChatSelect(chat.id)}
                    tabIndex={0}
                    role="button"
                    aria-pressed={false}
                  >
                    <span className="text-lg font-semibold text-foreground truncate">
                      {chat.title}
                    </span>
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
        </div>
      </main>
      <SidebarFooter />
    </div>
  )
}


export default ChatPage