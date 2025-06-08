# Sidebar

## Назначение
Модуль для отображения и управления боковой панелью (Sidebar) приложения, включая UI-компоненты и состояние.

## Структура
- `ui/sidebar.tsx` — основной компонент боковой панели.
- `model/sidebar-context.tsx` — React Context и провайдер состояния Sidebar.

## Основные компоненты и функции
- `Sidebar` — отображает список чатов и управляет состоянием открытия/закрытия.
- `SidebarProvider` — провайдер состояния Sidebar.
- `useSidebar` — хук для доступа к состоянию Sidebar.

## Пример использования
```tsx
import { SidebarProvider, useSidebar } from '@/features/sidebar/model/sidebar-context'
import Sidebar from '@/features/sidebar/ui/sidebar'

<SidebarProvider>
  <Sidebar />
</SidebarProvider>
```

## Особенности
- Адаптивность для мобильных устройств.
- Использует контекст для управления состоянием. 