/* НЕ ИСПОЛЬЗУЕТСЯ */

"use client"


import { Card, Tooltip, Button, Popover, PopoverTrigger, PopoverContent, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, useDisclosure } from "@heroui/react"
import { EllipsisVertical, Pencil, Trash, ArchiveRestore, Archive } from "lucide-react"
import { Chat } from "../model/chat"
import { useChatApi } from "../api/chat"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useRouter, usePathname } from "next/navigation"
import { useSidebar } from "@/widgets/sidebar/model/sidebar-context"

const CardPopover = ({ chatId, title, archived }: { chatId: string, title: string, archived?: boolean }) => {
  const { t } = useTranslation()
  const router = useRouter()
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure()
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [newTitle, setNewTitle] = useState(title)
  const { mutate: deleteChat, isPending: isDeleting } = useChatApi.useDeleteChat()
  const { mutate: changeChatTitle, isPending: isChangingTitle } = useChatApi.useChangeChatTitle()
  const { mutate: archiveChat, isPending: isArchiving } = useChatApi.useArchiveChat()
  const { mutate: unarchiveChat, isPending: isUnarchiving } = useChatApi.useUnarchiveChat()

  const handleRename = () => {
    if (newTitle.trim()) {
      changeChatTitle({ chatId, title: newTitle.trim() }, {
        onSuccess: () => {
          onModalClose()
        }
      })
    }
  }

  const handleOpenModal = () => {
    setIsPopoverOpen(false)
    onModalOpen()
  }

  const handleDelete = () => {
    setIsPopoverOpen(false)
    deleteChat(chatId, {
      onSuccess: () => {
        router.push('/chat')
      }
    })
  }

  const handleArchive = () => {
    setIsPopoverOpen(false)
    archiveChat(chatId)
  }

  const handleUnarchive = () => {
    setIsPopoverOpen(false)
    unarchiveChat(chatId)
  }

  return (
    <>
      <Popover placement="bottom-end" isOpen={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="light"
            size="sm"
            isIconOnly
            className="absolute top-1 right-1 z-10"
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); setIsPopoverOpen(v => !v) }}
            tabIndex={0}
            aria-label={t('chat.menu') || 'Меню'}
          >
            <EllipsisVertical className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent onClick={(e: React.MouseEvent) => e.stopPropagation()}>
          <Button variant="light" className="w-full" size="sm" startContent={<Pencil className="w-4 h-4" />} onPress={handleOpenModal}>
            <p>{t('button.rename')}</p>
          </Button>
          <Button variant="light" className="w-full" size="sm" startContent={<Trash className="w-4 h-4" />} onPress={handleDelete} isLoading={isDeleting}>
            <p>{t('button.delete')}</p>
          </Button>
          {archived ? (
            <Button variant="light" className="w-full" size="sm" startContent={<ArchiveRestore className="w-4 h-4" />} onPress={handleUnarchive} isLoading={isUnarchiving}>
              <p>{t('button.unarchive', 'Восстановить')}</p>
            </Button>
          ) : (
            <Button variant="light" className="w-full" size="sm" startContent={<Archive className="w-4 h-4" />} onPress={handleArchive} isLoading={isArchiving}>
              <p>{t('button.archive', 'Архивировать')}</p>
            </Button>
          )}
        </PopoverContent>
      </Popover>

      <Modal isOpen={isModalOpen} onClose={onModalClose}>
        <ModalContent>
          <ModalHeader>{t('chat.modal.rename')}</ModalHeader>
          <ModalBody>
            <Input
              label={t('chat.placeholder.title')}
              value={newTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTitle(e.target.value)}
              autoFocus
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onModalClose}>{t('button.cancel')}</Button>
            <Button 
              variant="flat" 
              onPress={handleRename} 
              isLoading={isChangingTitle}
              isDisabled={!newTitle.trim() || newTitle.trim() === title}
            >
              {t('button.save')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

const ChatCard = ({ id, title, archived }: Chat) => {
  const router = useRouter()
  const pathname = usePathname()
  const { setIsOpen } = useSidebar()
  
  const isSelected = pathname === `/chat/${id}`

  const handleChatClick = (e?: React.MouseEvent) => {
    if (e && (e.target as HTMLElement).closest('.absolute.top-1.right-1')) return;
    if (!isSelected) {
      router.push(`/chat/${id}`)
      if (window.innerWidth < 768) {
        setIsOpen(false)
      }
    }
  }

  return (
    <Card
      className={`w-full h-12 flex flex-row items-center justify-between rounded-lg shadow-none cursor-pointer relative ${
        isSelected 
          ? 'bg-primary/20' 
          : 'bg-primary'
      }`}
      onClick={handleChatClick}
    >
      <div className="flex-1 flex items-center min-w-0">
        <Tooltip content={title} delay={500}>
          <p className={`text-md overflow-hidden text-ellipsis whitespace-nowrap px-4 ${
            isSelected ? 'font-medium' : ''
          }`}>
            {title}
          </p>
        </Tooltip>
      </div>
      <CardPopover chatId={id} title={title} archived={archived} />
    </Card>
  )
}


export default ChatCard