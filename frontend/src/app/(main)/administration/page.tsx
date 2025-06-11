"use client";

import AdministrationTabs from "@/widgets/administation-tabs/ui/administation-tabs"

/**
 * AdministrationPage — страница административного интерфейса.
 * 
 * Компонент предоставляет:
 * - Управление пользователями
 * - Настройки системы
 * - Мониторинг и логи
 * - Управление правами доступа
 * 
 * Особенности:
 * - Табы для навигации между разделами
 * - Защищённый доступ (только для админов)
 * - Интеграция с API администрации
 * 
 * @returns {JSX.Element} Страница административного интерфейса
 */
const AdministrationPage = () => {
    return (
        <div className="flex flex-col gap-4">
            <AdministrationTabs />
        </div>
    )
}


export default AdministrationPage