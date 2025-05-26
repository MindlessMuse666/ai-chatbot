import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react"
import { useTranslation } from "react-i18next"
import Image from "next/image"
import { useTheme } from "@/shared/utils/providers/theme-provider"

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

const HelpModal = ({ isOpen, onClose }: HelpModalProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="lg"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          {t('help.title')}
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col items-center justify-center py-8">
            <Image 
              src={theme === 'light' ? '/logo-dark.svg' : '/logo.svg'} 
              alt="logo" 
              width={80} 
              height={80} 
              className="mb-6" 
            />
            <h3 className="text-2xl font-medium mb-2">Gravitino GPT</h3>
            <p className="text-foreground-secondary text-center mb-4">
              {t('help.description')}
            </p>
            <a 
              href={`mailto:${t('help.email')}`}
              className="text-primary-foreground hover:underline"
            >
              {t('help.email')}
            </a>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default HelpModal 