'use client'

import { Button } from '@heroui/react'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { useTheme } from '../utils/providers/theme-provider'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="flat"
      size="lg"
      isIconOnly
      onPress={toggleTheme}
    >
      {theme === 'light' ? (
        <MoonIcon className="h-6 w-6" />
      ) : (
        <SunIcon className="h-6 w-6" />
      )}
    </Button>
  )
} 