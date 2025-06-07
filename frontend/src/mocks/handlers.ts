/* Моки для MSW */

import { http, HttpResponse } from 'msw';
import { generateMessages } from './data';
import { MessageSender, MessageType } from '@/entities/chat/model/types';
import type { Chat, Message } from '@/entities/chat/model/types';
import type { User } from '@/entities/user/model/user';
import { UserStatus } from '@/entities/user/model/user';
import { Role } from '@/entities/role/model/role';

// Преобразование моковых сообщений в Message
function toMessage(msg: any): Message {
  return {
    id: msg.id,
    chatId: msg.chatId,
    content: msg.versions?.[0]?.content || '',
    type: msg.versions?.[0]?.type || MessageType.TEXT,
    createdAt: msg.versions?.[0]?.createdAt || new Date().toISOString(),
    updatedAt: msg.versions?.[0]?.createdAt || new Date().toISOString(),
    isEdited: false,
    sender: msg.role,
  };
}

// Инициализация моков чатов с сообщениями, lastMessage, firstMessage и title по первому сообщению
const chat1Messages = generateMessages('1', 20).map(toMessage);
const chat2Messages = generateMessages('2', 20).map(toMessage);
let chats: Chat[] = [
  {
    id: '1',
    title: chat1Messages[0]?.content || 'Чат 1',
    lastMessage: chat1Messages[chat1Messages.length - 1],
    createdAt: chat1Messages[0]?.createdAt || new Date().toISOString(),
    updatedAt: chat1Messages[chat1Messages.length - 1]?.createdAt || new Date().toISOString(),
    isArchived: false,
  },
  {
    id: '2',
    title: chat2Messages[0]?.content || 'Чат 2',
    lastMessage: chat2Messages[chat2Messages.length - 1],
    createdAt: chat2Messages[0]?.createdAt || new Date().toISOString(),
    updatedAt: chat2Messages[chat2Messages.length - 1]?.createdAt || new Date().toISOString(),
    isArchived: false,
  }
];
let messages: { [key: string]: Message[] } = {
  '1': chat1Messages,
  '2': chat2Messages
};

// Пример adminUser с полной типизацией
export const adminUser: User & { password: string } = {
  id: '1',
  email: 'dev@graviton.ru',
  name: 'Админ',
  status: UserStatus.ACTIVE,
  role: Role.ADMIN,
  userPermissions: [],
  createdAt: new Date(),
  password: 'zmvqfFNe',
};

// Массив пользователей для моков с поддержкой localStorage
let users: (User & { password: string })[] = [];
try {
  const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('msw-users') : null;
  users = saved ? JSON.parse(saved) : [adminUser];
  if (!saved && typeof localStorage !== 'undefined') {
    localStorage.setItem('msw-users', JSON.stringify(users));
  }
  console.log('[MSW] Loaded users:', users)
} catch {
  users = [adminUser];
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('msw-users', JSON.stringify(users));
  }
  console.log('[MSW] Loaded users fallback:', users)
}
function saveUsers() {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('msw-users', JSON.stringify(users));
      console.log('[MSW] Saved users:', users)
    }
  } catch {}
}

// Сохраняем lastLoggedInUserId в localStorage для кросс-табовой синхронизации
function setLastLoggedInUserId(id: string | null) {
  if (typeof localStorage !== 'undefined') {
    if (id) localStorage.setItem('msw-last-user', id);
    else localStorage.removeItem('msw-last-user');
  }
  lastLoggedInUserId = id;
}
function getLastLoggedInUserId(): string | null {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem('msw-last-user') || null;
  }
  return lastLoggedInUserId;
}
let lastLoggedInUserId: string | null = getLastLoggedInUserId();

export const handlers = [
  // Мок для аутентификации
  http.post('/api/v1.0/auth/login', async ({ request }) => {
    const { email, password } = (await request.json()) as { email?: string; password?: string };
    console.log('[MSW] Login attempt:', { email, password });
    console.log('[MSW] Users before login:', users)
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setLastLoggedInUserId(user.id);
      const { password: _, ...safeUser } = user;
      console.log('[MSW] Login success:', safeUser);
      return HttpResponse.json({ token: 'mock-token', user: safeUser }, { status: 200 });
    }
    console.log('[MSW] Login failed: Invalid credentials');
    return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }),

  // Мок для refresh токена
  http.post('/api/v1.0/auth/refresh', () => {
    return HttpResponse.json({ token: 'mock-token' }, { status: 200 });
  }),

  // Мок для регистрации
  http.post('/api/v1.0/auth/signup', async ({ request }) => {
    const { email, password, name } = (await request.json()) as { email?: string; password?: string; name?: string };
    console.log('[MSW] Signup attempt:', { email, password, name });
    console.log('[MSW] Users before signup:', users)
    if (!email || !password) {
      return HttpResponse.json({ message: 'Email and password required' }, { status: 400 });
    }
    if (users.some(u => u.email === email)) {
      return HttpResponse.json({ message: 'User already exists' }, { status: 409 });
    }
    const newUser: User & { password: string } = {
      id: String(Date.now()),
      email,
      name: name || 'Пользователь',
      status: UserStatus.ACTIVE,
      role: Role.USER,
      userPermissions: [],
      createdAt: new Date(),
      password,
    };
    users.push(newUser);
    saveUsers();
    setLastLoggedInUserId(newUser.id);
    const { password: _, ...safeUser } = newUser;
    console.log('[MSW] Signup success:', safeUser);
    console.log('[MSW] Users after signup:', users)
    return HttpResponse.json({ token: 'mock-token', user: safeUser }, { status: 201 });
  }),

  // Профиль пользователя
  http.get('/api/v1.0/user/profile', async ({ request }) => {
    // Получаем id последнего залогиненного пользователя из localStorage
    const currentUserId = getLastLoggedInUserId();
    const user = users.find(u => u.id === currentUserId);
    if (!user) {
      // Нет залогиненного пользователя — возвращаем 401
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const { password: _, ...safeUser } = user;
    console.log('[MSW] Profile request, returning user:', safeUser)
    return HttpResponse.json(safeUser, { status: 200 });
  }),

  // Обновление профиля пользователя
  http.post('/api/v1.0/user/profile', async ({ request }) => {
    const { name } = (await request.json()) as { name?: string; };
    const currentUserId = getLastLoggedInUserId();
    const user = users.find(u => u.id === currentUserId);
    if (!user) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    if (name) user.name = name;
    saveUsers();
    const { password: _, ...safeUser } = user;
    return HttpResponse.json(safeUser, { status: 200 });
  }),

  // Получение чатов
  http.get('/api/v1.0/chat', async ({ request }) => {
    return HttpResponse.json(chats.filter(c => !c.isArchived), { status: 200 });
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
    const now = new Date().toISOString();
    const newChat: Chat = {
      id: String(Date.now()),
      title: body.title || body.name || `Новый чат ${chats.length + 1}`,
      lastMessage: undefined,
      createdAt: now,
      updatedAt: now,
      isArchived: false,
    };
    chats.push(newChat);
    messages[newChat.id] = [];
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

  // Архивирование чата
  http.put('/api/v1.0/chat/:id/archive', ({ params }) => {
    const { id } = params;
    const chat = chats.find(c => c.id === id);
    if (chat) {
      chat.isArchived = true;
      return HttpResponse.json(chat, { status: 200 });
    }
    return HttpResponse.json({ message: 'Chat not found' }, { status: 404 });
  }),
  
  // Анархивирование чата
  http.put('/api/v1.0/chat/:id/unarchive', ({ params }) => {
    const { id } = params;
    const chat = chats.find(c => c.id === id);
    if (chat) {
      chat.isArchived = false;
      return HttpResponse.json(chat, { status: 200 });
    }
    return HttpResponse.json({ message: 'Chat not found' }, { status: 404 });
  }),

  // Получение всех чатов (неархивированных)
  http.get('/api/v1.0/chat', async ({ request }) => {
    return HttpResponse.json(chats.filter(c => !c.isArchived), { status: 200 });
  }),

  // Получение архивированных чатов
  http.get('/api/v1.0/chat/archived', async ({ request }) => {
    return HttpResponse.json(chats.filter(c => c.isArchived), { status: 200 });
  }),

  // Отправка сообщения (реалистично: сохраняем, обновляем lastMessage, эмулируем ассистента)
  http.post('/api/v1.0/chat/:chatId/messages', async ({ params, request }) => {
    const { chatId } = params;
    const { content, type } = (await request.json()) as { content: string; type: string };
    const newMessage: Message = {
      id: String(Date.now()),
      chatId: chatId as string,
      content,
      type: type as MessageType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isEdited: false,
      sender: MessageSender.USER,
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
    // // Эмулируем "ответ ассистента" через 1.5 секунды (можно усложнить)
    // setTimeout(() => {
    //   // Найти дату последнего сообщения
    //   const lastMsgArr = messages[chatId as string];
    //   let lastDate = new Date();
    //   if (lastMsgArr && lastMsgArr.length > 0) {
    //     const last = lastMsgArr[lastMsgArr.length - 1];
    //     lastDate = new Date(last.createdAt || Date.now());
    //   }
    //   const assistantMessage: Message = {
    //     id: String(Date.now() + 1),
    //     chatId: chatId as string,
    //     content: 'Это ответ ассистента (мок).',
    //     type: MessageType.TEXT,
    //     createdAt: new Date(lastDate.getTime() + 1000).toISOString(),
    //     updatedAt: new Date(lastDate.getTime() + 1000).toISOString(),
    //     isEdited: false,
    //     sender: MessageSender.AI,
    //   };
    //   if (!messages[chatId as string]) {
    //     messages[chatId as string] = [];
    //   }
    //   messages[chatId as string].push(assistantMessage);
    //   if (chat) {
    //     chat.lastMessage = assistantMessage;
    //   }
    // }, 1500);
    // return HttpResponse.json(newMessage, { status: 201 });
  }),

  // Мок для logout
  http.post('/api/v1.0/auth/logout', () => {
    setLastLoggedInUserId(null);
    return HttpResponse.json({ success: true }, { status: 200 });
  }),

  // TODO: добавить другие эндпоинты по необходимости
];