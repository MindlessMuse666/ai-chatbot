'use client'

import { Button, Card } from "@heroui/react"
import { Copy } from "lucide-react"
import { useState } from "react"
import { Message } from "../model/message"
import { useFormatMessageDate } from "@/shared/utils/format-date"
import { useTranslation } from "react-i18next"
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import FileCard from "./file-card"

const MessageCard = (message: Message) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const formatDate = useFormatMessageDate()
  const { t } = useTranslation()

  const handleCodeCopy = (code: string) => {
    const cleanCode = String(code).replace(/\n$/, '')
    navigator.clipboard.writeText(cleanCode)
    setCopiedCode(cleanCode)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const handleCopy = () => {
    if (message.versions?.[0]?.content) {
      navigator.clipboard.writeText(message.versions[0].content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!message.versions?.length) return null

  return (
    <div className={`w-full flex ${message.role === 'USER' ? 'justify-end' : 'justify-start'} mb-4`}>
      <Card 
        className={`w-[80%] p-4 ${
          message.role === 'USER' 
            ? 'bg-primary-foreground/10 border-primary-foreground/20' 
            : 'bg-background border-primary'
        }`}
      >
        <div className="flex justify-between items-start">
          <div className="flex flex-col w-full">
            {message.role !== 'USER' ? 
              <p className="text-sm font-medium mb-1">{t('chat.chatBox.assistant')}</p> : 
              <p className="text-sm font-medium mb-1">{t('chat.chatBox.user')}</p>
            }
            <div className="text-foreground break-words">
              {message.role === 'USER' ? (
                <p className="whitespace-pre-wrap">{message.versions[0]?.content}</p>
              ) : (
                <div className="prose max-w-none">
                  <ReactMarkdown
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      code(props: React.ComponentPropsWithoutRef<'code'> & { inline?: boolean }) {
                        const { className, children, inline } = props
                        const match = /language-(\w+)/.exec(className || '')
                        const language = match ? match[1] : ''
                        
                        const getCodeContent = () => {
                          if (typeof children === 'string') return children
                          if (Array.isArray(children)) {
                            return children
                              .map(child => {
                                if (typeof child === 'string') return child
                                if (typeof child === 'object' && child !== null) {
                                  return child.props?.children || ''
                                }
                                return ''
                              })
                              .join('')
                          }
                          return ''
                        }
                        
                        const codeContent = getCodeContent()
                        
                        if (!inline && language) {
                          return (
                            <div className="relative">
                              <div className="flex justify-between items-center bg-muted/50 rounded-t-lg border-b border-border mb-2 pb-[2px]">
                                <span className="text-sm text-muted-foreground">{language}</span>
                                <Copy 
                                  size={14} 
                                  className={`${copiedCode === codeContent ? "text-primary" : "text-muted-foreground"} cursor-pointer hover:text-primary transition-colors`}
                                  onClick={() => handleCodeCopy(codeContent)}
                                />
                              </div>
                              <code {...props} className={className}>
                                {children}
                              </code>
                            </div>
                          )
                        }
                        return <code {...props}>{children}</code>
                      }
                    }}
                  >
                    {message.versions[0]?.content || ''}
                  </ReactMarkdown>
                </div>
              )}
            </div>
            {message.versions[0]?.createdAt && 
              <p className="text-xs text-foreground-secondary mt-2">
                {formatDate(message.versions[0].createdAt)}
              </p>
            }
            {message.files && message.files.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {message.files.map((fileName, index) => (
                  <FileCard key={index} fileName={fileName} />
                ))}
              </div>
            )}
          </div>
          
          
          {message.role !== 'USER' && (
            <Button 
              isIconOnly 
              size="sm" 
              variant="light" 
              className="ml-2 flex-shrink-0" 
              onPress={handleCopy}
            >
              <Copy size={16} className={copied ? "text-primary-foreground" : "text-foreground-secondary"} />
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}

export default MessageCard
