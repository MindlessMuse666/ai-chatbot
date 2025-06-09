import React, { useEffect, useState, FC } from 'react';
import { format } from 'date-fns';
import { useChatStore } from '@/entities/chat/model/chat-store';
import { ChatActionsPopover } from '@/features/chat-list/ui/chat-actions-popover';
import type { Chat } from '@/features/chat-list/model/chat';
import type { Message } from '@/features/chat-box/model/message';

interface ChatListItemProps {
  chat: Chat & { lastMessage?: Message };
  onSelect: (chatId: string) => void;
  isArchived?: boolean;
}

/**
 * TimeClient — компонент для отображения времени сообщения.
 * @param date — дата/время
 */
function TimeClient({ date }: { date?: string | Date }) {
  const [time, setTime] = useState('');
  useEffect(() => {
    if (date) {
      setTime(format(new Date(date), 'HH:mm'));
    }
  }, [date]);
  return <span className="text-xs text-gray-400">{time}</span>;
}

/**
 * ChatListItem — элемент списка чатов в Sidebar.
 * Отображает название, время, статус, выделяет активный чат, реализует hover-эффекты.
 * @param chat — объект чата
 * @param onSelect — обработчик выбора чата
 * @param isArchived — флаг архивного чата
 * @module features/chat-list/ui/chat-list-item
 */
export const ChatListItem: FC<ChatListItemProps> = ({ chat, onSelect, isArchived }) => {
  const { currentChat } = useChatStore();
  const isActive = currentChat?.id === chat.id;

  return (
    <div
      className={
        `flex flex-col gap-1 p-4 rounded-2xl cursor-pointer relative transition-all duration-200 border-2 mb-2 ` +
        (isActive
          ? 'bg-primary-90 border-primary-foreground'
          : 'bg-primary-40 border-transparent hover:bg-primary-80 hover:border-primary-foreground')
      }
      onClick={() => onSelect(chat.id)}
      tabIndex={0}
      role="button"
      aria-pressed={isActive}
    >
      <div className="flex items-center justify-between gap-2 min-w-0">
        <div className="flex items-center min-w-0 gap-2">
          <h3 className="text-base font-semibold truncate max-w-[140px]">{chat.title || 'New Chat'}</h3>
          {isArchived && (
            <span className="px-1.5 py-0.5 text-xs rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 ml-2">
              Archived
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <ChatActionsPopover chatId={chat.id} isArchived={isArchived} />
        </div>
      </div>
      {chat.lastMessage && chat.lastMessage.versions?.[0]?.content ? (
        <div className="flex items-center gap-2 mt-1">
          <p className="text-xs text-foreground-secondary truncate">
            {chat.lastMessage.versions[0].content}
          </p>
          <TimeClient date={chat.lastMessage.versions[0].createdAt} />
        </div>
      ) : (
        <div className="flex items-center gap-2 mt-1">
          <TimeClient date={chat.createdAt} />
        </div>
      )}
    </div>
  );
};