import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@heroui/react';
import { toast } from 'sonner';
import { useChatStore } from '@/entities/chat/model/chat-store';
import { MessageList } from './message-list';
import { MessageSender, MessageType } from '@/entities/chat/model/types';
import { getSocket } from '@/shared/api/socket-service';
import { useSocketIO } from '@/shared/hooks/use-socket';
import AssistantTypingIndicator from './assistant-typing-indicator';
import SendInput from './send-input';
import CustomScroll from '@/shared/ui/custom-scroll';
import { ArrowDown } from 'lucide-react';

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
    setCurrentChat,
    handleWebSocketMessage,
    chats,
    isAwaitingAssistant,
  } = useChatStore();

  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Socket subscribe
  useSocketIO('message', (msg) => {
    handleWebSocketMessage(msg);
    if (msg.role === 'AI') {
      // setIsAssistantTyping(false);
    }
  });

  useEffect(() => {
    if (chatId) {
      fetchMessages(chatId).catch(console.error);
      const found = chats.find(chat => chat.id === chatId);
      setCurrentChat(found || null);
    }
  }, [chatId, fetchMessages, setCurrentChat]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Scroll to bottom
  const scrollToBottom = useCallback((smooth = false) => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const scrollOptions: ScrollToOptions = {
        top: container.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      };
      container.scrollTo(scrollOptions);
    }
  }, []);

  useEffect(() => {
    scrollToBottom(true);
  }, [messages, scrollToBottom]);

  // Show scroll button
  const handleScroll = useCallback(() => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
    }
  }, []);

  // Attach scroll event
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-deep-background rounded-lg p-2 md:p-4 mx-2 md:mx-10 relative">
      <div className="flex-1 overflow-hidden mb-4">
        <CustomScroll
          className="h-full px-2 md:px-4"
          forwardedRef={messagesContainerRef as React.RefObject<HTMLDivElement>}
          onScroll={handleScroll}
        >
          <div className="flex flex-col">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center mt-5">
                <h3 className="text-xl font-medium mb-2">Начните общение</h3>
                <p className="text-foreground-secondary max-w-md">Отправьте сообщение, чтобы начать диалог с ассистентом</p>
              </div>
            ) : (
              <>
                <MessageList messages={messages} />
                {isAwaitingAssistant && <AssistantTypingIndicator />}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>
        </CustomScroll>
      </div>
      {showScrollButton && (
        <Button
          isIconOnly
          variant="flat"
          className="absolute bottom-24 right-6 bg-primary-foreground text-background rounded-full shadow-lg z-10"
          onPress={() => scrollToBottom(true)}
        >
          <ArrowDown size={20} />
        </Button>
      )}
      <div className="w-full px-2 md:px-4 flex-shrink-0">
        <SendInput chatId={chatId} />
      </div>
    </div>
  );
}; 