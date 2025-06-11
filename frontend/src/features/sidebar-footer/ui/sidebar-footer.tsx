/**
 * SidebarFooter - компонент подвала сайдбара.
 * Отображает кнопки настроек и помощи, а также управляет модальными окнами.
 * 
 * @component
 * @returns {JSX.Element} Компонент подвала сайдбара
 */

'use client'

import { Button, useDisclosure } from "@heroui/react"
import { Settings, HelpCircle } from "lucide-react"
import { useTranslation } from "react-i18next"
import SettingsModal from "./settings-modal"
import HelpModal from "./help-modal"

const SidebarFooter = () => {
  const { t } = useTranslation()
  
  // Управление состоянием модального окна настроек
  const { 
    isOpen: isSettingsOpen, 
    onOpen: onSettingsOpen, 
    onClose: onSettingsClose 
  } = useDisclosure()

  // Управление состоянием модального окна помощи
  const { 
    isOpen: isHelpOpen, 
    onOpen: onHelpOpen, 
    onClose: onHelpClose 
  } = useDisclosure()

  return (
    <div className="flex flex-col w-full">
      {/* Текст помощи */}
      <p className="text-md text-foreground-secondary mb-2">
        {t('sidebar.footer.help')}
      </p>

      {/* Кнопка настроек */}
      <Button 
        variant="light" 
        size="lg" 
        className="w-full justify-start text-foreground hover:bg-primary" 
        startContent={<Settings className="w-5 h-5 mr-3" />}
        onPress={onSettingsOpen}
      >
        {t('button.settings')}
      </Button>

      {/* Кнопка помощи */}
      <Button 
        variant="light" 
        size="lg" 
        className="w-full justify-start text-foreground hover:bg-primary" 
        startContent={<HelpCircle className="w-5 h-5 mr-3" />}
        onPress={onHelpOpen}
      >
        {t('button.help')}
      </Button>

      {/* Копирайт */}
      <p className="text-sm text-foreground-secondary text-center mt-4">
        {t('sidebar.footer.copyright')}
      </p>

      {/* Модальные окна */}
      <SettingsModal isOpen={isSettingsOpen} onClose={onSettingsClose} />
      <HelpModal isOpen={isHelpOpen} onClose={onHelpClose} />
    </div>
  )
}

export default SidebarFooter
