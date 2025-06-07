"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useChatStore } from '@/entities/chat/model/chat-store';
import { ChatListItem } from './chat-list-item';
import { CreateChatButton } from './create-chat-button';

export const ChatList = () => {
  const router = useRouter();
  const { 
    chats, 
    archivedChats,
    isLoading, 
    error,
    fetchChats,
    fetchArchivedChats,
    setCurrentChat,
  } = useChatStore();

  useEffect(() => {
    fetchChats().catch(console.error);
    fetchArchivedChats().catch(console.error);
  }, [fetchChats, fetchArchivedChats]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleChatSelect = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId) || archivedChats.find(c => c.id === chatId);
    if (chat) {
      setCurrentChat(chat);
      router.push(`/chat/${chatId}`);
    }
  };

  if (isLoading && chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-2 text-sm text-gray-500">Loading chats...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Chats</h2>
        <CreateChatButton />
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 && archivedChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <p className="text-gray-500 mb-4">No chats yet</p>
            <CreateChatButton variant="outline" />
          </div>
        ) : (
          <>
            {chats.length > 0 && (
              <div className="p-2">
                {chats.map(chat => {
                  let chatBoxLastMessage = undefined;
                  if (chat.lastMessage) {
                    chatBoxLastMessage = {
                      ...chat.lastMessage,
                      role: chat.lastMessage.sender || 'USER',
                      versions: [
                        {
                          content: chat.lastMessage.content,
                          type: chat.lastMessage.type,
                          createdAt: chat.lastMessage.createdAt,
                        },
                      ],
                    };
                  }
                  return (
                    <ChatListItem
                      key={chat.id}
                      chat={{ ...chat, lastMessage: chatBoxLastMessage }}
                      onSelect={handleChatSelect}
                    />
                  );
                })}
              </div>
            )}

            {archivedChats.length > 0 && (
              <div className="mt-4">
                <div className="px-4 py-2 text-sm font-medium text-gray-500">
                  Archived
                </div>
                <div className="p-2">
                  {archivedChats.map(chat => {
                    let chatBoxLastMessage = undefined;
                    if (chat.lastMessage) {
                      chatBoxLastMessage = {
                        ...chat.lastMessage,
                        role: chat.lastMessage.sender || 'USER',
                        versions: [
                          {
                            content: chat.lastMessage.content,
                            type: chat.lastMessage.type,
                            createdAt: chat.lastMessage.createdAt,
                          },
                        ],
                      };
                    }
                    return (
                      <ChatListItem
                        key={chat.id}
                        chat={{ ...chat, lastMessage: chatBoxLastMessage }}
                        onSelect={handleChatSelect}
                        isArchived
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};