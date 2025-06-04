import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { MoreVertical, Archive, Trash } from 'lucide-react';
import { Button } from '@heroui/react';
import { toast } from 'sonner';
import type { Chat } from '@/entities/chat/model/types';
import type { Message } from '@/features/chat-box/model/message';
import { useChatStore } from '@/entities/chat/model/chat-store';

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
  const { 
    deleteChat, 
    hardDeleteChat, 
    archiveChat, 
    unarchiveChat,
    currentChat 
  } = useChatStore();

  const isActive = currentChat?.id === chat.id;

  const handleArchive = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      if (isArchived) {
        await unarchiveChat(chat.id);
        toast.success('Chat unarchived');
      } else {
        await archiveChat(chat.id);
        toast.success('Chat archived');
      }
    } catch (error) {
      toast.error('Failed to archive chat');
    }
  };

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      if (isArchived) {
        await hardDeleteChat(chat.id);
        toast.success('Chat permanently deleted');
      } else {
        await deleteChat(chat.id);
        toast.success('Chat moved to archive');
      }
    } catch (error) {
      toast.error('Failed to delete chat');
    }
  };

  return (
    <div
      className={`
        flex items-center gap-3 p-3 rounded-lg cursor-pointer
        hover:bg-gray-100 dark:hover:bg-gray-800
        ${isActive ? 'bg-gray-100 dark:bg-gray-800' : ''}
      `}
      onClick={() => onSelect(chat.id)}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium truncate">
            {chat.title || 'New Chat'}
          </h3>
          {isArchived && (
            <span className="px-1.5 py-0.5 text-xs rounded bg-gray-200 dark:bg-gray-700">
              Archived
            </span>
          )}
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

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleArchive}
        >
          <Archive className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleDelete}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}; 