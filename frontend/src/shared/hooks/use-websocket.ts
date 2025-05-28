import { useEffect, useCallback } from 'react';
import { getSocket } from '../api/socket-service';

export const useWebSocket = (event: string, onMessage?: (...args: any[]) => void) => {
  useEffect(() => {
    const socket = getSocket();
    socket.connect();
    if (onMessage) {
      socket.on(event, onMessage);
    }
    return () => {
      if (onMessage) {
        socket.off(event, onMessage);
      }
      socket.disconnect();
    };
  }, [event, onMessage]);

  const sendMessage = useCallback((type: string, payload: any) => {
    const socket = getSocket();
    socket.emit(type, payload);
  }, []);

  return { sendMessage };
}; 