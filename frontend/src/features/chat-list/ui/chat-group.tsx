/* НЕ ИСПОЛЬЗУЕТСЯ */

'use client'

import { Chat } from "../model/chat"
import ChatCard from "./chat-card"
import { useTranslation } from "react-i18next"

const ChatGroup = ({ chats, title }: { chats: Chat[], title: string }) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-md text-foreground-secondary">{t(`chat.group.${title}`)}</h1>
      <div className="flex flex-col gap-2">
        {chats.map((chat) => (
          <ChatCard key={chat.id} {...chat} />
        ))}
      </div>
    </div>
  )
}

export default ChatGroup
