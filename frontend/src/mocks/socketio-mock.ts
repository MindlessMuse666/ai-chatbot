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
    // Эмулируем получение нового сообщения
    socket.emit('message', {
      ...data,
      id: Math.random().toString(),
      createdAt: new Date().toISOString(),
    });
  });

  // ...другие события
}