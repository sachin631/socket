'use client';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const useSocket = (user_id) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user_id) {
      console.log('Connecting to socket server...');
      const socketInstance = io('http://localhost:5050', {
        query: { user_id },
        transports: ['websocket', 'polling'],
      });

      setSocket(socketInstance);

      socketInstance.on('connect', () => {
        console.log('Connected to socket server:', socketInstance.id);
      });

      socketInstance.on('disconnect', () => {
        console.log('Disconnected from socket server');
      });

      socketInstance.on('receive_message', (message) => {
        console.log('Message received:', message);
        // Update state or UI to handle the received message
      });

      return () => {
        console.log('Disconnecting from socket server...');
        socketInstance.disconnect();
      };
    }
  }, [user_id]);

  const sendMessage = (message) => {
    if (socket) {
      socket.emit('send_message', message);
      console.log('Message sent:', message);
    }
  };

  return { socket, sendMessage };
};

export default useSocket;
