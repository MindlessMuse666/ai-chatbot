/* Мокирование Socket.IO */

// Пример простого мок-сервера для socket.io (только для разработки)
import { getSocket } from '../shared/api/socket-service';
import { generateMessages } from './data';

export function setupSocketIOMock() {
  const socket = getSocket();

  // Пример: при подключении отправляем тестовые сообщения
  socket.on('connect', () => {
    // Можно эмулировать события, например:
    setTimeout(() => {
      socket.emit('message', generateMessages('1', 1)[0]);
    }, 1000);
  });

  // Мок обработчиков событий
  socket.on('sendMessage', (data) => {
    // Эмулируем получение нового сообщения пользователя
    socket.emit('message', {
      type: 'message',
      payload: {
        id: Math.random().toString(),
        chatId: data.chatId,
        role: 'USER',
        files: [],
        versions: [{
          content: data.content,
          type: data.type,
          createdAt: new Date().toISOString(),
        }],
      }
    });
    // Эмулируем ответ ассистента через 1.5 сек
    setTimeout(() => {
      socket.emit('message', {
        type: 'message',
        payload: {
          id: Math.random().toString(),
          chatId: data.chatId,
          role: 'AI',
          files: [],
          versions: [{
            content: 'Это ответ ассистента (мок).',
            type: 'TEXT',
            createdAt: new Date().toISOString(),
          }],
        }
      });
    }, 1500);
  });

  // ...другие события
}