"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useWebSocket } from "./websocket-provider";

export function NotificationsListener() {
  const { isConnected } = useWebSocket();

  useEffect(() => {
    if (!isConnected) return;

    const handleNotification = (event: Event) => {
      const customEvent = event as CustomEvent;
      const data = customEvent.detail;
      
      // Assume data has { title, message }
      toast(data.title || "New Notification", {
        description: data.message,
        position: "top-right",
      });
    };

    window.addEventListener("ws-notification", handleNotification);
    
    // Also handle chat messages globally if you want a toast for them
    const handleChatMessage = (event: Event) => {
      const customEvent = event as CustomEvent;
      const data = customEvent.detail;
      toast("New Message", {
        description: data.message,
        position: "top-right",
      });
    };
    
    window.addEventListener("ws-chat-message", handleChatMessage);

    return () => {
      window.removeEventListener("ws-notification", handleNotification);
      window.removeEventListener("ws-chat-message", handleChatMessage);
    };
  }, [isConnected]);

  return null; // This component does not render anything
}
