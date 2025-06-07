/* Мокирование Socket.IO */

// Пример простого мок-сервера для socket.io (только для разработки)
import { getSocket } from '../shared/api/socket-service';
import { generateMessages } from './data';

// Мок для socket.io-client

// Простейшая реализация фейкового сокета
class FakeSocket {
  connected = false;
  auth: any = {};
  private handlers: Record<string, Function[]> = {};

  on(event: string, handler: (...args: any[]) => void) {
    if (!this.handlers[event]) this.handlers[event] = [];
    this.handlers[event].push(handler);
  }
  off(event: string, handler: (...args: any[]) => void) {
    if (!this.handlers[event]) return;
    this.handlers[event] = this.handlers[event].filter(h => h !== handler);
  }
  emit(event: string, ...args: any[]) {
    if (this.handlers[event]) {
      this.handlers[event].forEach(h => h(...args));
    }
  }
  connect() {
    this.connected = true;
    // Можно эмулировать событие 'connect'
    this.emit('connect');
  }
  disconnect() {
    this.connected = false;
    this.emit('disconnect');
  }
}

export function setupSocketIOMock() {
  // Подменяем io глобально, если используется через window
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.io = () => new FakeSocket();
  }
  // Для импортов из 'socket.io-client' (работает только если используется esm-mock-loader или аналогичный подход)
  // В большинстве CRA/Vite/Next проектов это не сработает без дополнительной настройки, но window.io перекроет большинство кейсов.

  const socket = getSocket();

  // Пример: при подключении отправляем тестовые сообщения
  socket.on('connect', () => {
    // Можно эмулировать события, например:
    setTimeout(() => {
      socket.emit('message', generateMessages('1', 1)[0]);
    }, 1000);
  });

  // Мок обработчиков событий
  // socket.on('sendMessage', (data) => {
  //   // Эмулируем получение нового сообщения пользователя
  //   socket.emit('message', {
  //     type: 'message',
  //     payload: {
  //       id: Math.random().toString(),
  //       chatId: data.chatId,
  //       role: 'USER',
  //       files: [],
  //       versions: [{
  //         content: data.content,
  //         type: data.type,
  //         createdAt: new Date().toISOString(),
  //       }],
  //     }
  //   });
  //   // Эмулируем ответ ассистента через 1.5 сек
  //   setTimeout(() => {
  //     socket.emit('message', {
  //       type: 'message',
  //       payload: {
  //         id: Math.random().toString(),
  //         chatId: data.chatId,
  //         role: 'AI',
  //         files: [],
  //         versions: [{
  //           content: 'Это ответ ассистента (мок).',
  //           type: 'TEXT',
  //           createdAt: new Date().toISOString(),
  //         }],
  //       }
  //     });
  //   }, 1500);
  // }
  // });

  // ...другие события
}