import { io } from "socket.io-client";

const SOCKET_URL = "https://victor-agenda-app.onrender.com";

console.log("SOCKET_URL", SOCKET_URL);

const socket = io(SOCKET_URL, {
  withCredentials: true,
});

export default socket;
