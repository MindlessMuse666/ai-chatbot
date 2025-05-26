'use client'

import i18n from "@/shared/i18n/i18n";
import { queryClient } from "@/shared/lib/react-query";
import { HeroUIProvider } from "@heroui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import dynamic from 'next/dynamic'
import { ThemeProvider } from "./theme-provider";
import type { ToasterProps } from 'sonner';

// Динамический импорт Toaster только для клиента
const Toaster = dynamic<ToasterProps>(() => import('sonner').then(mod => mod.Toaster), { ssr: false });

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <HeroUIProvider>
          <I18nextProvider i18n={i18n}>
            <Toaster richColors position="bottom-left" />
            {children}
          </I18nextProvider>
        </HeroUIProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default Providers;
