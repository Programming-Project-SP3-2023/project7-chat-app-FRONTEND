import React, { createContext, useContext } from "react";
import { io } from "socket.io-client";
//local host
// temporary handled by temp server
const URL = "http://localhost:4001"; // temporary set to 4001 to use both

// prevent socket io auto connecting until user login
// const socket = io(URL, { autoConnect: false });
const socket = io(URL); // autoconnects for testing purposes

const SocketContext = createContext();

export function useSocket() {
  return useContext(SocketContext);
}
// socket provider
export function SocketProvider({ children }) {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
