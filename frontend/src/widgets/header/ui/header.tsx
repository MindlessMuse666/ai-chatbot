'use client'

import { useUserStore } from "@/entities/user/model/store"
import { Button, Popover, PopoverTrigger, PopoverContent } from "@heroui/react"
import Link from "next/link"
import { useEffect } from "react"
import Image from "next/image"
import { User, LogOut, Settings } from "lucide-react"
import { ThemeToggle } from "@/shared/ui/theme-toggle"
import { useTheme } from "@/shared/utils/providers/theme-provider"
import { useRouter } from "next/navigation"
import { Role } from "@/entities/role/model/role"
const Header = () => {
  const { theme } = useTheme()
  const { user, fetchUser } = useUserStore()
  const navigate = useRouter()

  useEffect(() => {
    if (!user) {
      fetchUser()
    }
  }, [user, fetchUser])

  return (
    <header className="border-b border-primary bg-background sticky top-0 z-10">
      <div className="mx-auto px-10 h-20 flex items-center justify-between">
        <Link href="/chat" className="text-xl font-semibold text-foreground">
          <Image src={theme === 'light' ? '/logo-dark.svg' : '/logo.svg'} alt="logo" width={40} height={40} />
        </Link>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <Popover placement="bottom-end">
              <PopoverTrigger asChild>
                <Button variant="flat" size="lg" isIconOnly>
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
                  {user?.role === Role.ADMIN && (
                    <>
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
                    </>
                  )}
                  <Button 
                    variant="light"
                    size="sm"
                    className="w-full justify-center text-foreground text-md hover:bg-primary" 
                    startContent={<LogOut className="w-5 h-5" />}
                    onPress={() => {
                      localStorage.removeItem('token')
                      document.cookie = `token=; path=/;`
                      localStorage.removeItem('refreshToken')
                      navigate.push('/login')
                    }}
                  >
                    Выйти
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
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
