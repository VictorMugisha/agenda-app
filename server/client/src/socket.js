import { io } from "socket.io-client";
import { getDevelopmentSocketURL, getProductionSocketURL } from "./utils/utils";
import { ENVIRONMENT } from "./constants/constants";

const SOCKET_URL =
  ENVIRONMENT === "development"
    ? getDevelopmentSocketURL()
    : getProductionSocketURL();

console.log("SOCKET_URL", SOCKET_URL);

const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,
});

export default socket;
