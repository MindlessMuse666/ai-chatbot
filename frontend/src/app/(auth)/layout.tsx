'use client'

import Image from 'next/image'
import { useTheme } from '@/shared/utils/providers/theme-provider'

/**
 * AuthLayout — layout для страниц аутентификации.
 * Добавляет фон, затемнение и логотип. Используется для login/register.
 * @param children — содержимое страницы (форма логина/регистрации)
 */
const AUTH_BG_STYLE: React.CSSProperties = {
  backgroundImage: 'url(/auth-bg.jpg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
};

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme()
  return (
    <div className="flex flex-col items-center justify-center h-screen relative"
      style={AUTH_BG_STYLE}
    >
      <div className="absolute inset-0 bg-black opacity-90" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[600px] h-[500px] bg-purple-900/30 rounded-full blur-[250px]" />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center">
          <Image src={theme === 'light' ? '/logo-dark.svg' : '/logo.svg'} alt="logo" width={50} height={50} className="mb-10" />  {/* TODO: протестить размер логотипа, чтобы не было предупреждений в консоли + поставить его на место */}
          {children}
        </div>
      </div>
    </div>
  )
}


export default AuthLayout