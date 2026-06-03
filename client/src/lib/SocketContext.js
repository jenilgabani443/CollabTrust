'use client';

import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

// CHANGED: Default fallback is now 3001 (your backend port)
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export function SocketProvider({ children }) {
  const { token } = useAuth();
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [token]);

  const joinCampaign = useCallback((campaignId) => {
    socketRef.current?.emit('join_campaign', campaignId);
  }, []);

  const sendMessage = useCallback((campaignId, text) => {
    socketRef.current?.emit('send_message', { campaignId, text });
  }, []);

  const onMessage = useCallback((callback) => {
    const socket = socketRef.current;
    if (!socket) return () => { };
    socket.on('receive_message', callback);
    return () => socket.off('receive_message', callback);
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, connected, joinCampaign, sendMessage, onMessage }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}