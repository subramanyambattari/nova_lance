"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";

type WebSocketContextType = {
  socket: WebSocket | null;
  isConnected: boolean;
  sendMessage: (type: string, payload: any) => void;
};

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false,
  sendMessage: () => {},
});

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId?: number;
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!userId) return;

    // Use current host for websocket
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}`;

    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      // Send init message
      ws.send(JSON.stringify({ type: "init", userId }));
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // We can handle global notifications here or just let components listen to ws.onmessage via effects
        if (data.type === 'notification') {
          // Fire a custom event or toast for notification
          window.dispatchEvent(new CustomEvent('ws-notification', { detail: data }));
        } else if (data.type === 'presence') {
          window.dispatchEvent(new CustomEvent('ws-presence', { detail: data }));
        } else if (data.type === 'chat_message') {
          window.dispatchEvent(new CustomEvent('ws-chat-message', { detail: data }));
        } else if (data.type === 'typing') {
          window.dispatchEvent(new CustomEvent('ws-typing', { detail: data }));
        } else if (data.type === 'ws-proposal-update') {
          window.dispatchEvent(new CustomEvent('ws-proposal-update', { detail: data }));
        } else if (data.type === 'ws-deliverable-upload') {
          window.dispatchEvent(new CustomEvent('ws-deliverable-upload', { detail: data }));
        }
      } catch (error) {
        console.error("Failed to parse WS message", error);
      }
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [userId]);

  const sendMessage = (type: string, payload: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type, ...payload }));
    }
  };

  return (
    <WebSocketContext.Provider value={{ socket, isConnected, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};
