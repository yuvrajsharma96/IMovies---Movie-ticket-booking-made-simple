import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || window.location.origin;

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('[Socket] Connected to real-time seat service:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('[Socket] Disconnected from seat service');
    });
  }
  return socket;
};

export default getSocket;
