"use client";

import { Button, useDisclosure } from "@heroui/react"
import { Settings, HelpCircle } from "lucide-react"
import { useTranslation } from "react-i18next"
import SettingsModal from "./settings-modal"
import HelpModal from "./help-modal"
import Image from "next/image"
import { useTheme } from "@/shared/utils/providers/theme-provider"

/**
 * SidebarFooter — современный футер приложения.
 * Повторяет стилистику Header, содержит логотип, копирайт и кнопки "Настройки" и "Помощь".
 * @module features/sidebar-footer/ui/sidebar-footer
 */
const SidebarFooter = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { 
    isOpen: isSettingsOpen, 
    onOpen: onSettingsOpen, 
    onClose: onSettingsClose 
  } = useDisclosure()
  const { 
    isOpen: isHelpOpen, 
    onOpen: onHelpOpen, 
    onClose: onHelpClose 
  } = useDisclosure()

  return (
    <footer className="border-t border-primary bg-background w-full h-20 flex items-center justify-between px-10 mt-auto">
      <div className="flex items-center">
        <Image src={theme === 'light' ? '/logo-dark.svg' : '/logo.svg'} alt="logo" width={40} height={40} />
      </div>
      <div className="flex-1 flex justify-center">
        <span className="text-[15px] font-medium text-foreground-secondary text-center select-none tracking-wide opacity-90">
          © 2025. Gravitino GPT
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="light"
          size="lg"
          className="flex items-center gap-2 rounded-lg bg-primary/40 hover:bg-primary-foreground text-foreground transition-colors duration-200 shadow-none px-4"
          startContent={<Settings className="w-5 h-5" />}
          onPress={onSettingsOpen}
        >
          {t('button.settings')}
        </Button>
        <Button
          variant="light"
          size="lg"
          className="flex items-center gap-2 rounded-lg bg-primary/40 hover:bg-primary-foreground text-foreground transition-colors duration-200 shadow-none px-4"
          startContent={<HelpCircle className="w-5 h-5" />}
          onPress={onHelpOpen}
        >
          {t('button.help')}
        </Button>
      </div>
      <SettingsModal isOpen={isSettingsOpen} onClose={onSettingsClose} />
      <HelpModal isOpen={isHelpOpen} onClose={onHelpClose} />
    </footer>
  )
}


export default SidebarFooter