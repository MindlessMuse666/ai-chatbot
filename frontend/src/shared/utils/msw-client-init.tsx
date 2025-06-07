"use client";

import { useEffect } from "react";

export default function MSWClientInit() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
      import('@/mocks/browser').then(({ worker }) => {
        worker.start({ onUnhandledRequest: 'bypass' }).then(() => {
          console.log('[MSW] Service worker started');
        }).catch((err) => {
          console.error('[MSW] Failed to start:', err);
        });
      });
      import('@/mocks/socketio-mock').then(({ setupSocketIOMock }) => setupSocketIOMock());
    }
  }, []);

  return null;
}
