/* Генерация моковых данных */

import { MessageSender } from '@/entities/chat/model/types';
import { faker } from '@faker-js/faker';
import { MessageType } from '@/entities/chat/model/types';

export function generateChats(count = 5) {
  return Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    name: faker.commerce.productName(),
    archived: false,
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  }));
}

export function generateMessages(chatId: string, count = 10) {
  const msgs = Array.from({ length: count }, (_, i) => ({
    id: faker.string.uuid(),
    chatId,
    role: MessageSender.USER,
    files: [],
    versions: [{
      content: faker.lorem.sentence(),
      type: MessageType.TEXT,
      createdAt: faker.date.recent().toISOString(),
    }],
  }));
  console.log('[FAKER] generateMessages:', { chatId, count, msgs });
  return msgs;
}