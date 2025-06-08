import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import type { Chat } from '../model/chat';
import type { Message } from '@/features/chat-box/model/message';
import { useChatStore } from '@/entities/chat/model/chat-store';
import { ChatActionsPopover } from './chat-actions-popover';

interface ChatListItemProps {
  chat: Chat & { lastMessage?: Message };
  onSelect: (chatId: string) => void;
  isArchived?: boolean;
}

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
export const ChatListItem = ({ chat, onSelect, isArchived }: ChatListItemProps) => {
  const { currentChat } = useChatStore();
  const isActive = currentChat?.id === chat.id;

  return (
    <div
      className={`
        flex flex-col gap-1 p-3 rounded-2xl cursor-pointer relative
        transition-colors duration-200
        border-none
        ${isActive
          ? 'bg-primary/80 dark:bg-primary/60'
          : 'bg-primary/40 dark:bg-primary/30 hover:bg-primary/90 dark:hover:bg-primary/80'}
      `}
      onClick={() => onSelect(chat.id)}
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