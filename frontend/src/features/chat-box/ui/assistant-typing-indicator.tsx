'use client'

import { useTranslation } from "react-i18next"

const AssistantTypingIndicator = () => {
  const { t } = useTranslation()

  return (
    <div className="w-[80%] p-4 mb-4 flex-shrink-0 bg-background border border-primary rounded-lg">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <p className="text-sm font-medium mb-6">{t('chat.chatBox.assistant')}</p>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-primary-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            <div className="w-2 h-2 bg-primary-foreground rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssistantTypingIndicator 