import { useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useToast } from './use-toast'; 

export const useWebSocket = () => {
  const { toast } = useToast();

  useEffect(() => {
    // 1. Initialize the client
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws-railway'),
      onConnect: () => {
        console.log('Connected to RailSense Real-Time Engine');
        
        // 2. Subscribe to the Java topic
        client.subscribe('/topic/network-updates', (message) => {
          const alert = JSON.parse(message.body);
          
          toast({
            title: "🚨 Live Network Alert",
            description: `${alert.stationCode}: ${alert.message}`,
            variant: "destructive",
          });
        });
      },
      // Adding debug to help you during the hackathon
      debug: (str) => {
        console.log('STOMP Debug:', str);
      },
    });

    // 3. Activate the connection
    client.activate();

    // 4. Cleanup function (Standard React pattern)
    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, [toast]); // Depend on toast so it doesn't re-run unnecessarily
};