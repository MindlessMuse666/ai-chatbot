"use client";

import React, { useState } from 'react';
import { MoreVertical, Archive, ArchiveRestore, Trash } from 'lucide-react';
import { Button, Popover, PopoverTrigger, PopoverContent } from '@heroui/react';
import { toast } from 'sonner';
import { useChatStore } from '@/entities/chat/model/chat-store';

interface ChatActionsPopoverProps {
  chatId: string;
  isArchived?: boolean;
}

export const ChatActionsPopover: React.FC<ChatActionsPopoverProps> = ({ chatId, isArchived }) => {
  const {
    deleteChat,
    hardDeleteChat,
    archiveChat,
    unarchiveChat
  } = useChatStore();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleArchive = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsPopoverOpen(false);
    try {
      if (isArchived) {
        await unarchiveChat(chatId);
        toast.success('Chat unarchived');
      } else {
        await archiveChat(chatId);
        toast.success('Chat archived');
      }
    } catch (error) {
      toast.error('Failed to archive chat');
    }
  };

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsPopoverOpen(false);
    try {
      if (isArchived) {
        await hardDeleteChat(chatId);
        toast.success('Chat permanently deleted');
      } else {
        await deleteChat(chatId);
        toast.success('Chat deleted');
      }
    } catch (error) {
      toast.error('Failed to delete chat');
    }
  };

  return (
    <Popover placement="bottom-end" isOpen={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger>
        <button
          className="bg-transparent border-none p-0 m-0 outline-none focus:outline-none hover:bg-gray-100 rounded transition-colors"
          style={{ lineHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setIsPopoverOpen(v => !v)}
          tabIndex={0}
          aria-label="Chat actions menu"
          type="button"
        >
          <MoreVertical className="h-5 w-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()} className="min-w-[160px]">
        <Button
          variant="light"
          className="w-full justify-start"
          size="sm"
          startContent={isArchived ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
          onClick={handleArchive}
        >
          {isArchived ? 'Восстановить' : 'Архивировать'}
        </Button>
        <Button
          variant="light"
          className="w-full justify-start mt-1"
          size="sm"
          startContent={<Trash className="h-4 w-4" />}
          onClick={handleDelete}
        >
          Удалить
        </Button>
      </PopoverContent>
    </Popover>
  );
}; 