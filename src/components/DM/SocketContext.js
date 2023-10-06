import React, { createContext, useContext } from "react";
import { io } from "socket.io-client";

const URL = "http://localhost:4000";

const socket = io(URL);

// const socket = io(URL, { autoConnect: false });
const SocketContext = createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
