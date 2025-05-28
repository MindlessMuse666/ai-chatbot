/* Моки для MSW */

import { http, HttpResponse } from 'msw';
import { adminUser, generateChats, generateMessages } from './data';

// Типизация для чатов и сообщений
interface Chat {
  id: string;
  title: string;
  lastMessage?: any;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}
interface Message {
  id: string;
  chatId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  type: string;
  isEdited: boolean;
  sender?: 'USER' | 'AI';
}

let chats: Chat[] = [
  { id: '1', title: 'Тестовый чат 1', lastMessage: undefined, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), archived: false },
  { id: '2', title: 'Тестовый чат 2', lastMessage: undefined, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), archived: false }
];
let messages: { [key: string]: Message[] } = {
  '1': generateMessages('1', 20),
  '2': generateMessages('2', 20)
};

export const handlers = [
  // Аутентификация
  http.post('/api/v1.0/auth/login', async ({ request }) => {
    const { email, password } = (await request.json()) as { email?: string; password?: string };
    if (email === adminUser.email && password === adminUser.password) {
      return HttpResponse.json({ token: 'mock-token', user: adminUser }, { status: 200 });
    }
    return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }),

  // Мок для refresh токена
  http.post('/api/v1.0/auth/refresh', () => {
    return HttpResponse.json({ token: 'mock-token' }, { status: 200 });
  }),

  // Регистрация
  http.post('/api/v1.0/auth/signup', async ({ request }) => {
    const { email, password, name } = (await request.json()) as { email?: string; password?: string; name?: string };
    if (!email || !password) {
      return HttpResponse.json({ message: 'Email and password required' }, { status: 400 });
    }
    if (email === adminUser.email) {
      return HttpResponse.json({ message: 'User already exists' }, { status: 409 });
    }
    const newUser = {
      id: String(Date.now()),
      email,
      password,
      role: 'USER',
      name: name || 'Пользователь',
      avatar: '',
    };
    return HttpResponse.json({ token: 'mock-token', user: newUser }, { status: 201 });
  }),

  // Профиль пользователя
  http.get('/api/v1.0/user/profile', () => {
    return HttpResponse.json(adminUser, { status: 200 });
  }),

  // Получение чатов (множественное и единственное число)
  http.get('/api/v1.0/chats', () => {
    return HttpResponse.json(chats, { status: 200 });
  }),
  http.get('/api/v1.0/chat', () => {
    return HttpResponse.json(chats, { status: 200 });
  }),

  // Получение сообщений с поддержкой offset/limit и page/limit
  http.get('/api/v1.0/chats/:chatId/messages', ({ params, request }) => {
    const { chatId } = params;
    const url = new URL(request.url);
    const offset = url.searchParams.has('offset')
      ? parseInt(url.searchParams.get('offset') || '0', 10)
      : ((parseInt(url.searchParams.get('page') || '1', 10) - 1) * parseInt(url.searchParams.get('limit') || '20', 10));
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);
    let allMessages = messages[chatId as string] || [];
    // Сортируем по времени (от старых к новым)
    allMessages = allMessages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    const paged = allMessages.slice(offset, offset + limit).map(msg => ({
      ...msg,
      sender: msg.userId === 'assistant' ? 'AI' : 'USER',
    }));
    return HttpResponse.json({
      total: allMessages.length,
      messages: paged,
    }, { status: 200 });
  }),

  // Создание чата (множественное и единственное число, поддержка title и name)
  http.post('/api/v1.0/chats', async ({ request }) => {
    const body = (await request.json()) as { name?: string; title?: string };
    const newChat: Chat = {
      id: String(Date.now()),
      title: body.title || body.name || `Чат ${chats.length + 1}`,
      lastMessage: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      archived: false,
    };
    chats.unshift(newChat);
    messages[newChat.id] = generateMessages(newChat.id, 20);
    return HttpResponse.json(newChat, { status: 201 });
  }),
  http.post('/api/v1.0/chat', async ({ request }) => {
    const body = (await request.json()) as { name?: string; title?: string };
    const newChat: Chat = {
      id: String(Date.now()),
      title: body.title || body.name || `Чат ${chats.length + 1}`,
      lastMessage: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      archived: false,
    };
    chats.unshift(newChat);
    messages[newChat.id] = generateMessages(newChat.id, 20);
    return HttpResponse.json(newChat, { status: 201 });
  }),

  // Обновление чата (PUT/PATCH)
  http.put('/api/v1.0/chats/:id', async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as { name?: string; title?: string };
    const chat = chats.find((c) => c.id === id);
    if (chat) {
      chat.title = body.title || body.name || chat.title;
      chat.updatedAt = new Date().toISOString();
      return HttpResponse.json(chat, { status: 200 });
    }
    return HttpResponse.json({ message: 'Chat not found' }, { status: 404 });
  }),
  http.patch('/api/v1.0/chats/:id', async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as { name?: string; title?: string };
    const chat = chats.find((c) => c.id === id);
    if (chat) {
      chat.title = body.title || body.name || chat.title;
      chat.updatedAt = new Date().toISOString();
      return HttpResponse.json(chat, { status: 200 });
    }
    return HttpResponse.json({ message: 'Chat not found' }, { status: 404 });
  }),

  // Мягкое удаление чата
  http.delete('/api/v1.0/chats/:id', ({ params }) => {
    const { id } = params;
    chats = chats.filter((c) => c.id !== id);
    delete messages[id as string];
    return HttpResponse.json({ success: true }, { status: 200 });
  }),

  // Архивация/разархивация чата
  http.put('/api/v1.0/chats/:id/archive', ({ params }) => {
    const { id } = params;
    const chat = chats.find((c) => c.id === id);
    if (chat) {
      chat.archived = true;
      return HttpResponse.json(chat, { status: 200 });
    }
    return HttpResponse.json({ message: 'Chat not found' }, { status: 404 });
  }),
  http.put('/api/v1.0/chats/:id/unarchive', ({ params }) => {
    const { id } = params;
    const chat = chats.find((c) => c.id === id);
    if (chat) {
      chat.archived = false;
      return HttpResponse.json(chat, { status: 200 });
    }
    return HttpResponse.json({ message: 'Chat not found' }, { status: 404 });
  }),

  // Отправка сообщения (реалистично: сохраняем, обновляем lastMessage, эмулируем ассистента)
  http.post('/api/v1.0/chats/:chatId/messages', async ({ params, request }) => {
    const { chatId } = params;
    const { content, type } = (await request.json()) as { content: string; type: string };
    const newMessage: Message = {
      id: String(Date.now()),
      chatId: chatId as string,
      userId: adminUser.id,
      content: content,
      type: type || 'TEXT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isEdited: false,
      sender: 'USER',
    };
    if (!messages[chatId as string]) {
      messages[chatId as string] = [];
    }
    messages[chatId as string].push(newMessage);
    // Обновляем lastMessage в чате
    const chat = chats.find((c) => c.id === chatId);
    if (chat) {
      chat.lastMessage = newMessage;
      chat.updatedAt = newMessage.createdAt;
    }
    // Эмулируем "ответ ассистента" через 1.5 секунды (можно усложнить)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: String(Date.now() + 1),
        chatId: chatId as string,
        userId: 'assistant',
        content: 'Это ответ ассистента (мок).',
        type: 'TEXT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isEdited: false,
        sender: 'AI',
      };
      messages[chatId as string].push(assistantMessage);
      if (chat) {
        chat.lastMessage = assistantMessage;
        chat.updatedAt = assistantMessage.createdAt;
      }
    }, 1500);
    return HttpResponse.json(newMessage, { status: 201 });
  }),

  // Архивированные чаты
  http.get('/api/v1.0/chat/archived', () => {
    return HttpResponse.json([], { status: 200 });
  }),
  http.get('/api/v1.0/chats/archived', () => {
    return HttpResponse.json(chats.filter((c) => c.archived), { status: 200 });
  }),

  // TODO: добавить другие эндпоинты по необходимости
];