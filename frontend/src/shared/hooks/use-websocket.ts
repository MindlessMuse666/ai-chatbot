import { useEffect, useCallback } from 'react';
import { wsClient, type WebSocketMessage } from '../api/websocket-client';

export const useWebSocket = (onMessage?: (message: WebSocketMessage) => void) => {
  useEffect(() => {
    wsClient.connect();

    let unsubscribe: (() => void) | undefined;
    if (onMessage) {
      unsubscribe = wsClient.subscribe(onMessage);
    }

    return () => {
      unsubscribe?.();
      wsClient.disconnect();
    };
  }, [onMessage]);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    wsClient.send(message);
  }, []);

  return { sendMessage };
}; 