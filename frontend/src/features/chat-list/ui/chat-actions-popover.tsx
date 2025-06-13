"use client";

import React, { useState, MouseEvent } from 'react';
import { MoreVertical, Archive, ArchiveRestore, Trash } from 'lucide-react';
import { Button, Popover, PopoverTrigger, PopoverContent } from '@heroui/react';
import { toast } from 'sonner';
import { useChatStore } from '@/entities/chat/model/chat-store';

interface ChatActionsPopoverProps {
  chatId: string;
  isArchived?: boolean;
}

/**
 * ChatActionsPopover — поповер с действиями над чатом (архив, удаление).
 * @param chatId — идентификатор чата
 * @param isArchived — флаг архивного чата
 * @module features/chat-list/ui/chat-actions-popover
 */
export const ChatActionsPopover: React.FC<ChatActionsPopoverProps> = ({ chatId, isArchived }) => {
  const {
    deleteChat,
    hardDeleteChat,
    archiveChat,
    unarchiveChat
  } = useChatStore();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  /**
   * Обработчик архивации/восстановления чата.
   */
  const handleArchive = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsPopoverOpen(false);
    try {
      if (isArchived) {
        await unarchiveChat(chatId);
        toast.success('Чат восстановлен');
      } else {
        await archiveChat(chatId);
        toast.success('Чат архивирован');
      }
    } catch (error) {
      toast.error('Ошибка при архивации чата');
    }
  };

  /**
   * Обработчик удаления чата (мягкое/жёсткое).
   */
  const handleDelete = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsPopoverOpen(false);
    try {
      if (isArchived) {
        await hardDeleteChat(chatId);
        toast.success('Чат удалён безвозвратно');
      } else {
        await deleteChat(chatId);
        toast.success('Чат удалён');
      }
    } catch (error) {
      toast.error('Ошибка при удалении чата');
    }
  };

  return (
    <Popover placement="right-start" isOpen={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger>
        <button
          className="bg-transparent border-none p-0 m-0 outline-none focus:outline-none hover:bg-gray-100 rounded transition-colors"
          style={{ lineHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setIsPopoverOpen(v => !v)}
          tabIndex={0}
          aria-label="Меню действий с чатом"
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