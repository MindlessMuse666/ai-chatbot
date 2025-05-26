import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';
import { v4 as uuidv4 } from 'uuid';
import { MessageType, MessageSender } from '../src/entities/chat/model/types';
import type { Message, Chat } from '../src/entities/chat/model/types';

const PORT = 3001;
const httpServer = createServer();
const wss = new WebSocketServer({ server: httpServer });

// In-memory storage for testing
const chats: Chat[] = [];
const messages: Message[] = [];

// Helper functions
const createMessage = (chatId: string, content: string, sender: MessageSender): Message => ({
  id: uuidv4(),
  chatId,
  content,
  type: MessageType.TEXT,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isEdited: false,
  sender,
});

const broadcastMessage = (message: unknown) => {
  wss.clients.forEach((client: WebSocket) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};

// WebSocket connection handling
wss.on('connection', (ws: WebSocket) => {
  console.log('Client connected');

  ws.on('message', (data: Buffer) => {
    try {
      const message = JSON.parse(data.toString());
      
      switch (message.type) {
        case 'message': {
          const { chatId, content } = message.payload;
          
          // Create AI response
          const userMessage = createMessage(chatId, content, MessageSender.USER);
          const aiMessage = createMessage(
            chatId,
            `Echo: ${content} (This is a mock response)`,
            MessageSender.AI
          );

          // Store messages
          messages.push(userMessage, aiMessage);

          // Broadcast messages to all clients
          broadcastMessage({
            type: 'message',
            payload: userMessage,
          });

          // Simulate AI delay
          setTimeout(() => {
            broadcastMessage({
              type: 'message',
              payload: aiMessage,
            });
          }, 1000);

          break;
        }

        default:
          console.warn('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        payload: 'Invalid message format',
      }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`Mock WebSocket server running on ws://localhost:${PORT}`);
}); 