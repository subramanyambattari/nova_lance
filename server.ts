import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { WebSocketServer, WebSocket } from 'ws';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      
      // Internal IPC route for Next.js API routes to trigger WS broadcasts
      if (parsedUrl.pathname === '/api/internal/ws-broadcast' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            // Broadcast to all clients (or specific user if data.userId is present)
            if (data.userId) {
              const client = clients.get(data.userId);
              if (client && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data.payload));
              }
            } else {
              broadcast(-1, data.payload); // -1 means all clients
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
          } catch (e) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
          }
        });
        return;
      }
      
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  // Attach WebSocket Server
  const wss = new WebSocketServer({ server });

  // Map to store connected clients: userId -> WebSocket
  const clients = new Map<number, WebSocket>();

  wss.on('connection', (ws, req) => {
    let userId: number | null = null;
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'init') {
          userId = data.userId;
          if (userId) {
            clients.set(userId, ws);
            // Broadcast that user is online
            broadcast(userId, { type: 'presence', userId, online: true });
          }
        } else if (data.type === 'chat_message') {
          // Send message to the recipient if online
          const recipientWs = clients.get(data.recipientId);
          if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
            recipientWs.send(JSON.stringify({
              type: 'chat_message',
              message: data.message,
              senderId: userId
            }));
          }
        } else if (data.type === 'typing') {
          const recipientWs = clients.get(data.recipientId);
          if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
            recipientWs.send(JSON.stringify({
              type: 'typing',
              senderId: userId,
              isTyping: data.isTyping
            }));
          }
        }
      } catch (e) {
        console.error('Invalid WS message:', e);
      }
    });

    ws.on('close', () => {
      if (userId) {
        clients.delete(userId);
        // Broadcast that user is offline
        broadcast(userId, { type: 'presence', userId, online: false });
      }
    });
    
    ws.on('error', console.error);
  });
  
  function broadcast(excludeUserId: number, payload: any) {
    const msg = JSON.stringify(payload);
    clients.forEach((client, id) => {
      if (id !== excludeUserId && client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    });
  }

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`> WebSocket Server listening on ws://${hostname}:${port}`);
  });
});
