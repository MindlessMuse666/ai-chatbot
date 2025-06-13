/**
 * SettingsModal - модальное окно настроек.
 * Отображает заглушку для будущих настроек приложения.
 * 
 * @component
 * @param {Object} props - Свойства компонента
 * @param {boolean} props.isOpen - Флаг открытия модального окна
 * @param {() => void} props.onClose - Функция закрытия модального окна
 * @returns {JSX.Element} Модальное окно настроек
 */

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
            {/* Иконка настроек */}
            <Settings className="w-16 h-16 text-primary-foreground mb-4" />

            {/* Заголовок */}
            <h3 className="text-xl font-medium mb-2">В разработке</h3>

            {/* Сообщение о разработке */}
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