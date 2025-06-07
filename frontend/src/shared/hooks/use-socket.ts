import { useEffect } from 'react';
import { getSocket } from '../api/socket-service';


export function useSocketIO(event: string, handler: (...args: any[]) => void) {
  useEffect(() => {
    const s = getSocket();
    s.on(event, handler);
    return () => {
      s.off(event, handler);
    };
  }, [event, handler]);
} 