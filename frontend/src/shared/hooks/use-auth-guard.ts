import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/model/auth-store';

/**
 * useAuthGuard — защищает маршрут, редиректит на /login если пользователь не авторизован
 */
export function useAuthGuard() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login?reason=auth');
    }
  }, [isAuthenticated, isLoading, router]);
} 