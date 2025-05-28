'use client'

import SendInput from "@/features/chat-box/ui/send-input"
import MessageCard from "@/features/chat-box/ui/message-card"
import AssistantTypingIndicator from "@/features/chat-box/ui/assistant-typing-indicator"
import { useRef, useEffect, useState, useCallback } from "react"
import CustomScroll from "@/shared/ui/custom-scroll"
import { useParams } from "next/navigation"
import { useMessageApi } from "@/features/chat-box/api/message"
import { useInView } from "react-intersection-observer"
import { useTranslation } from "react-i18next"
import { ArrowDown } from "lucide-react"
import { Button } from "@heroui/react"

const ChatBox = () => {
  const { t } = useTranslation()
  const params = useParams<{ id?: string }>();
  const chatId = params?.id ?? '';
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const { ref: loadMoreRef, inView } = useInView()
  const [initialLoad, setInitialLoad] = useState(true)
  const [prevScrollHeight, setPrevScrollHeight] = useState(0)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [optimisticMessages, setOptimisticMessages] = useState<any[]>([])
  const [isAssistantTyping, setIsAssistantTyping] = useState(false)
  const [isAtBottom, setIsAtBottom] = useState(true)
  
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    isLoading
  } = useMessageApi.useInfiniteMessages(chatId)

  const isEmpty = !isLoading && (!data || data.pages.every(page => page.messages.length === 0)) && optimisticMessages.length === 0
  
  const scrollToBottom = useCallback((smooth = false) => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current
      const scrollOptions: ScrollToOptions = {
        top: container.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      }
      
      container.scrollTo(scrollOptions)
    }
  }, [])

  const scrollToBottomAfterSend = useCallback((tempMessage: any) => {
    setOptimisticMessages(prev => [...prev, tempMessage])
    
    setIsAssistantTyping(true)

    setTimeout(() => {
      scrollToBottom()
      setTimeout(() => {
        scrollToBottom()
      }, 100)
    }, 10)
  }, [scrollToBottom])

  const handleMessageError = useCallback((messageId: string) => {
    setOptimisticMessages(prev => prev.filter(msg => msg.id !== messageId))
    setIsAssistantTyping(false)
  }, [])

  const handleScroll = useCallback(() => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
      const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100
      const isBottom = scrollHeight - scrollTop - clientHeight < 50
      setShowScrollButton(isScrolledUp)
      setIsAtBottom(isBottom)
    }
  }, [])

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      setIsLoadingMore(true)
      if (messagesContainerRef.current) {
        setPrevScrollHeight(messagesContainerRef.current.scrollHeight)
      }
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  useEffect(() => {
    if (data?.pages && data.pages.length > 0) {
      setOptimisticMessages([])
      setIsAssistantTyping(false)
    }
  }, [data])

  useEffect(() => {
    if (!messagesContainerRef.current || isLoading) return;
    
    if (initialLoad && !isEmpty && (data?.pages.length || optimisticMessages.length)) {
      scrollToBottom()
      setInitialLoad(false)
    } else if (isLoadingMore && !isFetchingNextPage) {
      const newScrollHeight = messagesContainerRef.current.scrollHeight
      const scrollDiff = newScrollHeight - prevScrollHeight
      messagesContainerRef.current.scrollTop += scrollDiff
      setIsLoadingMore(false)
    }

    const scrollContainer = messagesContainerRef.current
    scrollContainer.addEventListener('scroll', handleScroll)
    
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll)
    }
  }, [data, isLoading, isEmpty, initialLoad, isFetchingNextPage, isLoadingMore, prevScrollHeight, scrollToBottom, handleScroll, optimisticMessages])

  useEffect(() => {
    if (optimisticMessages.length > 0 && isAtBottom) {
      scrollToBottom()
    }
  }, [optimisticMessages, scrollToBottom, isAtBottom])

  useEffect(() => {
    if (data?.pages && data.pages.length > 0) {
      const lastPage = data.pages[data.pages.length - 1]
      const lastMessage = lastPage.messages[lastPage.messages.length - 1]
      if (lastMessage && !isLoadingMore && isAtBottom) {
        scrollToBottom()
      }
    }
  }, [data, isLoadingMore, scrollToBottom, isAtBottom])

  useEffect(() => {
    setOptimisticMessages([]);
    setIsAssistantTyping(false);
    setInitialLoad(true);
  }, [chatId]);

  return (
    <div className="w-full h-full flex flex-col bg-deep-background rounded-lg p-2 md:p-4 mx-2 md:mx-10 relative">
      <div className="flex-1 overflow-hidden mb-4">
        <CustomScroll 
          className="h-full px-2 md:px-4"
          forwardedRef={messagesContainerRef as React.RefObject<HTMLDivElement>}
          onScroll={handleScroll}
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p>{t('chat.chatBox.loading')}</p>
            </div>
          ) : isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full text-center mt-5">
              <h3 className="text-xl font-medium mb-2">{t('chat.chatBox.emptyTitle')}</h3>
              <p className="text-foreground-secondary max-w-md">{t('chat.chatBox.emptyDescription')}</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {hasNextPage && (
                <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
                  {isFetchingNextPage && <p className="text-sm text-foreground-secondary">{t('chat.chatBox.loadingPrevious')}</p>}
                </div>
              )}
              
              {data?.pages.slice().reverse().map((page, i) => (
                <div key={i}>
                  {page.messages.slice().reverse().map((message: any) => (
                    <MessageCard 
                      key={message.id}
                      {...message}
                    />
                  ))}
                </div>
              ))}
              
              {optimisticMessages.map((message) => (
                <MessageCard 
                  key={message.id}
                  {...message}
                />
              ))}
              
              {isAssistantTyping && <AssistantTypingIndicator />}
            </div>
          )}
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
        <SendInput 
          chatId={chatId} 
          onMessageSent={scrollToBottomAfterSend} 
          onMessageError={handleMessageError}
        />
      </div>
    </div>
  )
}

export default ChatBox
