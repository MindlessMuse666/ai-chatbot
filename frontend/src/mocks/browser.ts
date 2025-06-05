/* Инициализация MSW */

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

// console.log('[MSW] Worker instance created');