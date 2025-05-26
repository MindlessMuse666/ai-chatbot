import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react"
import { Settings } from "lucide-react"
import { useTranslation } from "react-i18next"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { t } = useTranslation()

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="lg"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          {t('button.settings')}
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col items-center justify-center py-8">
            <Settings className="w-16 h-16 text-primary-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">В разработке</h3>
            <p className="text-foreground-secondary text-center">
              Этот раздел находится в разработке и будет доступен в ближайшее время
            </p>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default SettingsModal 