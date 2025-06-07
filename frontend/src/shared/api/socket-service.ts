/* Базовый сервис Socket.IO */

import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000'; // или любой другой URL

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false, // ручное подключение
      transports: ['websocket'],
      // auth: { token: ... } // если нужно
    });
  }
  return socket;
}

import { useEffect } from 'react';

export function useSocket(event: string, handler: (...args: any[]) => void) {
  useEffect(() => {
    const s = getSocket();
    s.on(event, handler);
    return () => {
      s.off(event, handler);
    };
  }, [event, handler]);
}

export function updateSocketAuth(token: string | null) {
  const s = getSocket();
  s.auth = { token };
  if (token) {
    if (!s.connected) s.connect();
  } else {
    if (s.connected) s.disconnect();
  }
}