import React, { useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@heroui/react';
import { toast } from 'sonner';
import { useChatStore } from '@/entities/chat/model/chat-store';
import { MessageList } from './message-list';
import { MessageInput } from './message-input';
import { MessageType } from '@/entities/chat/model/types';
import { useWebSocket } from '@/shared/hooks/use-websocket';

interface ChatBoxProps {
  chatId: string;
}

export const ChatBox = ({ chatId }: ChatBoxProps) => {
  const { 
    currentChat,
    messages,
    isLoading,
    error,
    fetchMessages,
    sendMessage,
    setCurrentChat,
    handleWebSocketMessage,
  } = useChatStore();

  // Подписываемся на событие 'message' через Socket.IO
  const { sendMessage: sendSocketMessage } = useWebSocket('message', handleWebSocketMessage);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatId) {
      fetchMessages(chatId).catch(console.error);
    }
  }, [chatId, fetchMessages]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    // Прокрутка к последнему сообщению при загрузке новых сообщений
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    try {
      const messageDto = {
        chatId,
        content: content.trim(),
        type: MessageType.TEXT,
      };

      // Отправляем сообщение через Socket.IO
      sendSocketMessage('sendMessage', messageDto);

      // Также сохраняем в базе данных через REST API
      await sendMessage(messageDto);

      // ДОБАВИТЬ: обновить список сообщений после отправки
      await fetchMessages(chatId);
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={messages} />
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <MessageInput onSend={handleSendMessage} />
      </div>
    </div>
  );
}; 