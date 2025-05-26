import { useTranslation } from 'react-i18next'

/**
 * Форматирует дату сообщения в зависимости от времени создания
 * @param dateString - строка с датой в формате ISO
 * @returns отформатированная строка с датой
 */
export const useFormatMessageDate = () => {
  const { t } = useTranslation()
  
  return (dateString: string): string => {
    if (!dateString) return ''
    
    const date = new Date(dateString)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    // Проверяем, что дата валидна
    if (isNaN(date.getTime())) return ''
    
    // Форматируем время
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const time = `${hours}:${minutes}`
    
    // Сегодня
    if (date >= today) {
      return `${t('time.today')}, ${time}`
    }
    
    // Вчера
    if (date >= yesterday) {
      return `${t('time.yesterday')}, ${time}`
    }
    
    // В этом году
    if (date.getFullYear() === now.getFullYear()) {
      const day = date.getDate().toString().padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      return `${day}.${month}, ${time}`
    }
    
    // Другие годы
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}.${month}.${year}, ${time}`
  }
} 