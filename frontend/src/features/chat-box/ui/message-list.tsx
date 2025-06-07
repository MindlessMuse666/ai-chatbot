import React from 'react';
import type { Message } from '@/entities/chat/model/types';
import MessageCard from './message-card';

interface MessageListProps {
  messages: Message[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  // Преобразуем сообщения к типу с versions и role для MessageCard
  const normalizedMessages = messages.map((msg) => ({
    ...msg,
    role: msg.sender || 'USER',
    versions: [
      {
        content: msg.content,
        type: msg.type,
        createdAt: msg.createdAt,
      },
    ],
  }));

  return (
    <div className="flex flex-col">
      {normalizedMessages
        .slice()
        .sort((a, b) => {
          const getDate = (msg: any) =>
            Array.isArray(msg.versions) && msg.versions[0]?.createdAt
              ? msg.versions[0].createdAt
              : msg.createdAt;
          return new Date(getDate(a)).getTime() - new Date(getDate(b)).getTime();
        })
        .map((message) => (
          <MessageCard key={message.id} {...message} />
        ))}
    </div>
  );
}; 