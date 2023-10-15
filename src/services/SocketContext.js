import React, { createContext, useContext, useState, useEffect } from "react";
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
  const [authData, setAuthData] = useState(null);

  // set persistant socket data
  useEffect(() => {
    if (authData) {
      socket.auth = { token: authData.token };
    }
  }, [authData]);
  //
  const contextValue = {
    socket,
    authData,
    loginSocket: (accountID, username) => {
      setAuthData({ accountID, username });
      socket.auth = { accountID, username: username };
      console.log("login socket userid: " + accountID + "username" + username);
      socket.connect();
    },
    logout: () => {
      setAuthData(null);
      socket.disconnect();
    },
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
}
