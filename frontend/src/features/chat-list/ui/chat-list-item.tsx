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

export const ChatListItem = ({ chat, onSelect, isArchived }: ChatListItemProps) => {
  const { currentChat } = useChatStore();
  const isActive = currentChat?.id === chat.id;

  return (
    <div
      className={`
        flex flex-col gap-1 p-3 rounded-lg cursor-pointer relative
        hover:bg-gray-100 dark:hover:bg-gray-800
        ${isActive ? 'bg-gray-100 dark:bg-gray-800' : ''}
      `}
      onClick={() => onSelect(chat.id)}
    >
      <div className="flex items-center justify-between gap-2 min-w-0">
        <div className="flex items-center min-w-0 gap-2">
          <h3 className="text-sm font-medium truncate max-w-[140px]">{chat.title || 'New Chat'}</h3>
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
          <p className="text-xs text-gray-500 truncate">
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