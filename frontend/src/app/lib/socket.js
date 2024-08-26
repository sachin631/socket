'use client'
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const useSocket = (user_id) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user_id) {
        console.log('connected')
      const socketInstance = io('http://localhost:3000', {
        query: { user_id },
        transports: ['websocket'],
      });

      setSocket(socketInstance);

      socketInstance.on('connect', () => {
        console.log('Connected to socket server:', socketInstance.id);
      });

      socketInstance.on('disconnect', () => {
        console.log('Disconnected from socket server');
      });

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [user_id]);

  return socket;
};

export default useSocket;
