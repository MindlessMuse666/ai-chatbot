import React from 'react';
import { format } from 'date-fns';
import { Edit2, Trash2 } from 'lucide-react';
import { Button } from '@heroui/react';
import { toast } from 'sonner';
import type { Message } from '@/entities/chat/model/types';
import { useChatStore } from '@/entities/chat/model/chat-store';
import { MessageSender } from '@/entities/chat/model/types';

interface MessageListProps {
  messages: Message[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  const { updateMessage, deleteMessage } = useChatStore();

  const handleEditMessage = async (message: Message) => {
    // TODO: Implement message editing UI
    toast.info('Message editing coming soon');
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage(messageId);
      toast.success('Message deleted');
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`
            flex gap-3 max-w-[80%]
            ${message.sender === MessageSender.USER ? 'ml-auto' : 'mr-auto'}
          `}
        >
          <div
            className={`
              rounded-lg p-3
              ${message.sender === MessageSender.USER 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted'
              }
            `}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm whitespace-pre-wrap break-words">
                {message.content}
              </p>
              
              {message.sender === MessageSender.USER && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleEditMessage(message)}
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleDeleteMessage(message.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs opacity-70">
                {format(new Date(message.createdAt), 'HH:mm')}
              </span>
              {message.isEdited && (
                <span className="text-xs opacity-70">(edited)</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}; 