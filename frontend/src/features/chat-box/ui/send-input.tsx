'use client'

import * as React from 'react'
import { useState, useRef } from 'react'
import { Button } from '@heroui/react'
import { ArrowUp, Paperclip, File, FileText, Image, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useChatStore } from '@/entities/chat/model/chat-store'
import { v4 as uuidv4 } from 'uuid'
import { mediaApi } from '@/entities/media/api/media'
import { UploadingFile } from '@/entities/media/model/media'
import { MessageType } from '@/entities/chat/model/types'
interface SendInputProps {
  chatId: string
  onMessageSent?: (tempMessage: any) => void
  onMessageError?: (messageId: string) => void
}

const SendInput = ({ chatId, onMessageSent, onMessageError }: SendInputProps) => {
  const { t } = useTranslation()
  const [message, setMessage] = useState('')
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const maxSymbols = 10000
  const { sendMessage, isLoading } = useChatStore();

  const handleDragEnter = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY
    
    if (
      x <= rect.left ||
      x >= rect.right ||
      y <= rect.top ||
      y >= rect.bottom
    ) {
      setIsDragging(false)
    }
  }

  const handleDragOver = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDrop = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      const newFiles: UploadingFile[] = files.map((file) => ({
        id: uuidv4(),
        file: file as File,
        progress: 0
      }))
      setUploadingFiles((prev: UploadingFile[]) => [...prev, ...newFiles])
      uploadFiles(newFiles)
    }
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  const handleFileSelect = (e: any) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      const newFiles: UploadingFile[] = files.map((file) => ({
        id: uuidv4(),
        file: file as File,
        progress: 0
      }))
      setUploadingFiles((prev: UploadingFile[]) => [...prev, ...newFiles])
      uploadFiles(newFiles)
    }
  }

  const uploadFiles = async (files: UploadingFile[]) => {
    for (const fileData of files) {
      try {
        const response = await mediaApi.uploadMedia(fileData.file)
        setUploadingFiles((prev: UploadingFile[]) => prev.map((f: UploadingFile) =>
          f.id === fileData.id
            ? { ...f, link: response.link, progress: 100 }
            : f
        ))
      } catch {
        setUploadingFiles((prev: UploadingFile[]) => prev.filter((f: UploadingFile) => f.id !== fileData.id))
      }
    }
  }

  const removeFile = (fileId: string) => {
    setUploadingFiles((prev: UploadingFile[]) => prev.filter((f: UploadingFile) => f.id !== fileId))
  }

  const getFileIcon = (file: File) => {
    const type = file.type
    if (type.startsWith('image/')) return <Image size={16} />
    if (type.includes('pdf') || type.includes('text')) return <FileText size={16} />
    return <File size={16} />
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    const hasUploadingFiles = uploadingFiles.some((file: UploadingFile) => file.progress !== 100)
    if (message.trim() && !isOverLimit && !hasUploadingFiles) {
      const tempId = uuidv4()
      const uploadedUrls = uploadingFiles
        .filter((file: UploadingFile) => file.progress === 100 && file.link)
        .map((file: UploadingFile) => file.link!)

      const tempMessage = {
        id: tempId,
        role: 'USER',
        versions: [
          {
            content: message.trim(),
            type: 'TEXT',
            createdAt: new Date().toISOString()
          }
        ],
        isPending: true
      }
      
      if (onMessageSent) {
        onMessageSent(tempMessage)
      }
      
      setMessage('')
      setUploadingFiles([])
      
      sendMessage({ 
        chatId,
        type: MessageType.TEXT,
        content: message.trim(),
      })
    }
  }

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (message.trim() && !isOverLimit && !isLoading) {
        handleSubmit(e)
      }
    }
  }

  const remainingSymbols = maxSymbols - message.length
  const isOverLimit = remainingSymbols < 0

  return (
    <form 
      onSubmit={handleSubmit} 
      className="w-full flex flex-col items-start gap-2 relative"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
    >
      {isDragging && (
        <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm flex items-center justify-center rounded-lg border-2 border-dashed border-primary z-50">
          <div className="flex flex-col items-center gap-2">
            <Paperclip size={24} className="text-primary" />
            <p className="text-primary font-medium">{t('chat.dropFiles')}</p>
          </div>
        </div>
      )}
      <div className={`text-xs self-start ml-2 ${isOverLimit ? 'text-red-500' : 'text-gray-500'}`}>
        {remainingSymbols}
      </div>
      <div className="w-full flex items-start gap-2">
        <textarea
          value={message}
          onChange={(e: any) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('chat.placeholder.send')}
          rows={1}
          className="flex-grow resize-none px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px] max-h-[200px]"
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          className="hidden"
        />
        <Button 
          type="button"
          isIconOnly
          variant="flat"
          radius="md"
          onClick={() => fileInputRef.current?.click()}
          className="bg-primary-foreground text-background shadow-sm transition-all duration-200 hover:bg-primary-foreground/90 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          isDisabled={isLoading}
        >
          <Paperclip size={18} />
        </Button>
        <Button 
          type="submit" 
          isIconOnly
          variant="flat"
          radius="md"
          isLoading={isLoading}
          className="bg-primary-foreground text-background shadow-sm transition-all duration-200 hover:bg-primary-foreground/90 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          isDisabled={!message.trim() || isOverLimit || isLoading || uploadingFiles.some((file: UploadingFile) => file.progress !== 100)}
        >
          <ArrowUp size={18} />
        </Button>
      </div>
      {uploadingFiles.length > 0 && (
        <div className="w-full mt-2 flex flex-wrap gap-2">
          {uploadingFiles.map((file: UploadingFile) => (
            <div 
              key={file.id} 
              className="flex items-center gap-2 text-sm bg-background-secondary/50 px-2 py-1 rounded-lg"
            >
              {file.progress === 100 ? (
                <>
                  {getFileIcon(file.file)}
                  <a 
                    href={file.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-foreground hover:underline max-w-[200px] truncate"
                  >
                    {file.file.name}
                  </a>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="text-foreground-secondary hover:text-foreground transition-colors"
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="truncate max-w-[200px]">{file.file.name}</span>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </form>
  )
}

export default SendInput
