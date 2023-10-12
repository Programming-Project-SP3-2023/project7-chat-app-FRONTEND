import React, { createContext, useContext } from "react";
import { io } from "socket.io-client";

//local host
const URL = "http://localhost:4000"; //

// prevent socket io auto connecting
const socket = io(URL, { autoConnect: false });

// creating a socket context in order to use throughout app
const SocketContext = createContext();
// useContext allows the socket to be used
export function useSocket() {
  return useContext(SocketContext);
}

// wraps the components to allow use of the socket component
export function SocketProvider({ children }) {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
