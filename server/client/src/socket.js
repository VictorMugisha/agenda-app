import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

console.log("SOCKET_URL", SOCKET_URL);

const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ['websocket', 'polling'], // Try forcing websocket first
  timeout: 10000, // Set a connection timeout
});

socket.on('connect', () => {
  console.log('Socket connected successfully');
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error);
});

export default socket;
