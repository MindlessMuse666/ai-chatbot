/**
 * Header — верхний компонент приложения.
 * Отображает логотип, переключатель темы, профиль пользователя и навигацию.
 * Для ADMIN отображает кнопку перехода в админ-панель.
 * @module features/header
 */
"use client";

import { Button, Popover, PopoverTrigger, PopoverContent } from "@heroui/react"
import Link from "next/link"
import Image from "next/image"
import { User, LogOut, Settings } from "lucide-react"
import { ThemeToggle } from "@/shared/ui/theme-toggle"
import { useTheme } from "@/shared/utils/providers/theme-provider"
import { useRouter } from "next/navigation"
import { Role } from "@/entities/role/model/role"
import { useAuthStore } from "@/features/auth/model/auth-store"

/**
 * Header — основной компонент верхней панели.
 * Показывает логотип, переключатель темы, профиль пользователя и навигацию.
 * @returns {JSX.Element}
 */
const Header = () => {
  const { theme } = useTheme()
  const { user, logout } = useAuthStore()
  const navigate = useRouter()

  return (
    <header className="border-b border-primary bg-background sticky top-0 z-10">
      <div className="mx-auto px-10 h-20 flex items-center justify-between">
        {/* Логотип и переход на главную */}
        <Link href="/chat" className="text-xl font-semibold text-foreground">
          <Image src={theme === 'light' ? '/logo-dark.svg' : '/logo.svg'} alt="logo" width={40} height={40} />
        </Link>

        <div className="flex items-center gap-4">
          {/* Переключатель темы */}
          <ThemeToggle />
          {/* Если пользователь авторизован — показываем профиль */}
          {user ? (
            <Popover placement="bottom-end">
              <PopoverTrigger asChild>
                <Button variant="flat" size="lg" isIconOnly aria-label="Профиль">
                  <User className="w-6 h-6" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-4 w-64">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col">
                    <p className="text-md font-medium">{user?.name || "Пользователь"}</p>
                    <p className="text-sm text-foreground-secondary">{user?.email || "email@example.com"}</p>
                    <p className="text-sm text-foreground-secondary">{user?.role === Role.ADMIN ? "Администратор" : "Пользователь"}</p>
                  </div>
                  <div className="w-full h-[1px] bg-primary my-1" />
                  {/* Кнопка администрирования только для ADMIN */}
                  {user?.role === Role.ADMIN && (
                    <Button 
                      variant="light"
                      size="sm"
                      className="w-full justify-center text-foreground text-md hover:bg-primary" 
                      startContent={<Settings className="w-5 h-5" />}
                      onPress={() => {
                        navigate.push('/administration')
                      }}
                    >
                      Администрирование
                    </Button>
                  )}
                  {/* Кнопка выхода */}
                  <Button 
                    variant="light"
                    size="sm"
                    className="w-full justify-center text-foreground text-md hover:bg-primary" 
                    startContent={<LogOut className="w-5 h-5" />}
                    onPress={async () => {
                      await logout()
                      localStorage.removeItem('token')
                      document.cookie = `token=; path=/;`
                      localStorage.removeItem('refreshToken')
                    }}
                  >
                    Выйти
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            // Кнопка входа для неавторизованных
            <Button 
              variant="flat" 
              size="lg"
              onPress={() => navigate.push('/login')}
            >
              Войти
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}


export default Header