# 🤖 AI-Chatbot — умный ИИ-поисковик для ООО "Гравитон"

![AI-Chatbot Screenshot](./public/demo-screenshot.png)

## 🚀 О проекте

AI-Chatbot — это современный фронтенд для умного ИИ-поисковика товаров компании "ООО Гравитон".  
Проект реализован на Next.js, React, TypeScript, Zustand, React Query, TailwindCSS и поддерживает real-time обмен сообщениями через WebSocket.

### Основные возможности

- 🔐 Аутентификация и регистрация пользователей
- 💬 Список чатов и интерфейс общения
- ⚡️ Мгновенные сообщения через WebSocket
- 🗂 Архивация, удаление и восстановление чатов
- 📁 Загрузка и отображение файлов в сообщениях
- 🧑‍💼 Административный функционал (для роли ADMIN)
- 🌙 Поддержка темной темы и адаптивная верстка

## 📦 Технологии

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [React Query](https://tanstack.com/query/latest)
- [TailwindCSS](https://tailwindcss.com/)
- [Sonner](https://sonner.emilkowal.ski/) (toast-уведомления)
- [ws](https://github.com/websockets/ws) (mock WebSocket сервер)

## 🛠️ Быстрый старт

```bash
git clone https://github.com/your-org/ai-chatbot.git
cd ai-chatbot/frontend
npm install
npm run dev
```

Для запуска mock WebSocket сервера:
```bash
cd frontend
npm run mock-server
```

## 🖼️ Демонстрация

> _Скриншоты интерфейса:_

![Login](./public/demo-login.png)
![Chat List](./public/demo-chats.png)
![Chat Box](./public/demo-chatbox.png)

_(В будущем будет доступна онлайн-демо-версия на отдельном домене)_

## 📄 Техническое задание

Примерное ТЗ доступно в файле [`requirements_specification_graviton.txt`](REQUIREMENTS-SPECIFICATION-GRAVITON.md).

## 📝 Лицензия

Этот проект распространяется под лицензией MIT. Подробности в файле [LICENSE](LICENSE).

## 👥 Автор

MindlessMuse666
- [GitHub](https://github.com/MindlessMuse666)
- [Telegram](t.me/mindless_muse)
- [Gmail](mindlessmuse.666@gmail.com)

## 🙏 Благодарности

Next.js, React, Zustand, React Query, TailwindCSS, Sonner, ws и всем авторам open-source библиотек!