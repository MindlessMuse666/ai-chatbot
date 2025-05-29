/* Моки для MSW */

import { http, HttpResponse } from 'msw';
import { adminUser, generateChats, generateMessages } from './data';
import { MessageSender, MessageType } from '@/entities/chat/model/types';

// Переопределяем функцию generateMessages для MSW-совместимого формата
function toUiMessage(msg: any) {
  return {
    id: msg.id,
    chatId: msg.chatId,
    role: msg.sender,
    files: [],
    versions: [{
      content: msg.content,
      type: msg.type,
      createdAt: msg.createdAt,
    }],
  };
}

// Инициализация моков чатов с сообщениями, lastMessage, firstMessage и title по первому сообщению
const chat1Messages = generateMessages('1', 20);
const chat2Messages = generateMessages('2', 20);
let chats = [
  {
    id: '1',
    title: chat1Messages[0]?.versions[0]?.content || 'Чат 1',
    messages: chat1Messages,
    lastMessage: chat1Messages[chat1Messages.length - 1],
    firstMessage: chat1Messages[0],
    createdAt: chat1Messages[0]?.versions[0]?.createdAt || new Date().toISOString(),
    updatedAt: chat1Messages[chat1Messages.length - 1]?.versions[0]?.createdAt || new Date().toISOString(),
    archived: false,
  },
  {
    id: '2',
    title: chat2Messages[0]?.versions[0]?.content || 'Чат 2',
    messages: chat2Messages,
    lastMessage: chat2Messages[chat2Messages.length - 1],
    firstMessage: chat2Messages[0],
    createdAt: chat2Messages[0]?.versions[0]?.createdAt || new Date().toISOString(),
    updatedAt: chat2Messages[chat2Messages.length - 1]?.versions[0]?.createdAt || new Date().toISOString(),
    archived: false,
  }
];
let messages: { [key: string]: any[] } = {
  '1': chat1Messages,
  '2': chat2Messages
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

  // Получение чатов
  http.get('/api/v1.0/chat', () => {
    return HttpResponse.json(chats, { status: 200 });
  }),

  // Получение сообщений с поддержкой offset/limit и page/limit
  http.get('/api/v1.0/chat/:chatId/messages', ({ params, request }) => {
    const { chatId } = params;
    const url = new URL(request.url);
    const offset = url.searchParams.has('offset')
      ? parseInt(url.searchParams.get('offset') || '0', 10)
      : ((parseInt(url.searchParams.get('page') || '1', 10) - 1) * parseInt(url.searchParams.get('limit') || '20', 10));
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);
    let allMessages = messages[chatId as string] || [];
    // Сортируем по времени (от старых к новым)
    allMessages = allMessages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    const paged = allMessages.slice(offset, offset + limit);
    return HttpResponse.json({
      total: allMessages.length,
      messages: paged,
    }, { status: 200 });
  }),

  // Создание чата (поддержка title и name)
  http.post('/api/v1.0/chat', async ({ request }) => {
    const body = (await request.json()) as { name?: string; title?: string };
    // const generatedMessages = generateMessages(String(Date.now()), 20);
    const now = new Date().toISOString();
    const newChat = {
      id: String(Date.now()),
      title: `Новый чат ${chats.length + 1}`,
      messages: [],
      lastMessage: {} as any,
      firstMessage: {} as any,
      createdAt: now,
      updatedAt: now,
      archived: false,
    };
    chats.push(newChat);
    console.log('[MSW] Chat created:', newChat);
    return HttpResponse.json(newChat, { status: 201 });
  }),

  // Обновление чата (PUT/PATCH)
  http.put('/api/v1.0/chat/:id', async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as { name?: string; title?: string };
    const chat = chats.find(c => c.id === id);
    if (chat) {
      chat.title = body.title || body.name || chat.title;
      chat.updatedAt = new Date().toISOString();
      return HttpResponse.json(chat, { status: 200 });
    }
    return HttpResponse.json({ message: 'Chat not found' }, { status: 404 });
  }),
  http.patch('/api/v1.0/chat/:id', async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as { name?: string; title?: string };
    const chat = chats.find(c => c.id === id);
    if (chat) {
      chat.title = body.title || body.name || chat.title;
      chat.updatedAt = new Date().toISOString();
      return HttpResponse.json(chat, { status: 200 });
    }
    return HttpResponse.json({ message: 'Chat not found' }, { status: 404 });
  }),

  // Мягкое удаление чата
  http.delete('/api/v1.0/chat/:id', ({ params }) => {
    const { id } = params;
    chats = chats.filter(c => c.id !== id);
    delete messages[id as string];
    return HttpResponse.json({ success: true }, { status: 200 });
  }),

  // Архивация/разархивация чата
  http.put('/api/v1.0/chat/:id/archive', ({ params }) => {
    const { id } = params;
    const chat = chats.find(c => c.id === id);
    if (chat) {
      chat.archived = true;
      return HttpResponse.json(chat, { status: 200 });
    }
    return HttpResponse.json({ message: 'Chat not found' }, { status: 404 });
  }),
  http.put('/api/v1.0/chat/:id/unarchive', ({ params }) => {
    const { id } = params;
    const chat = chats.find(c => c.id === id);
    if (chat) {
      chat.archived = false;
      return HttpResponse.json(chat, { status: 200 });
    }
    return HttpResponse.json({ message: 'Chat not found' }, { status: 404 });
  }),

  // Отправка сообщения (реалистично: сохраняем, обновляем lastMessage, эмулируем ассистента)
  http.post('/api/v1.0/chat/:chatId/messages', async ({ params, request }) => {
    const { chatId } = params;
    const { content, type } = (await request.json()) as { content: string; type: string };
    const newMessage = {
      id: String(Date.now()),
      chatId: chatId as string,
      role: MessageSender.USER,
      files: [],
      versions: [{
        content,
        type: MessageType.TEXT,
        createdAt: new Date().toISOString(),
      }],
    };
    if (!messages[chatId as string]) {
      messages[chatId as string] = [];
    }
    messages[chatId as string].push(newMessage);
    // Обновляем lastMessage в чате
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      chat.lastMessage = newMessage;
    }
    console.log('[MSW] Message created:', newMessage);
    // Эмулируем "ответ ассистента" через 1.5 секунды (можно усложнить)
    setTimeout(() => {
      // Найти дату последнего сообщения
      const lastMsgArr = messages[chatId as string];
      let lastDate = new Date();
      if (lastMsgArr && lastMsgArr.length > 0) {
        const last = lastMsgArr[lastMsgArr.length - 1];
        lastDate = new Date(last.versions?.[0]?.createdAt || last.createdAt || Date.now());
      }
      const assistantMessage = {
        id: String(Date.now() + 1),
        chatId: chatId as string,
        role: MessageSender.AI,
        files: [],
        versions: [{
          content: 'Это ответ ассистента (мок).',
          type: MessageType.TEXT,
          createdAt: new Date(lastDate.getTime() + 1000).toISOString(),
        }],
      };
      if (!messages[chatId as string]) {
        messages[chatId as string] = [];
      }
      messages[chatId as string].push(assistantMessage);
      if (chat) {
        chat.lastMessage = assistantMessage;
      }
      console.log('[MSW] Assistant message created:', assistantMessage);
    }, 1500);
    return HttpResponse.json(newMessage, { status: 201 });
  }),

  // Архивированные чаты
  http.get('/api/v1.0/chat/archived', () => {
    return HttpResponse.json([], { status: 200 });
  }),
  http.get('/api/v1.0/chat/archived', () => {
    return HttpResponse.json(chats.filter(c => c.archived), { status: 200 });
  }),

  // TODO: добавить другие эндпоинты по необходимости
];