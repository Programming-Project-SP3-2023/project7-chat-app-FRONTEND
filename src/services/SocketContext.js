import React, { createContext, useContext, useEffect } from "react";
import { io } from "socket.io-client";

// host
const URL = process.env.REACT_APP_BASEURL;


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
  useEffect(() => {
    // listeners
    socket.on("connectionResponse", (response) => {
    });

    socket.on("onlineFriends", (friends) => {
    });

    socket.on("messageHistory", (messages) => {
    });

    socket.on("messageResponse", (data) => {
    });

    socket.on("userConnected", (userDetails) => {
    });

    socket.on("error", (error) => {
    });

    socket.on("userDisconnected", (userDetails) => {
    });

    socket.on("connectGroupResponse", (groupResponse) => {
    });

    socket.on("connectChannelResponse", (channelResponse) => {
    });

    return () => {
      socket.off("connectionReponse");
      socket.off("onlineFriends");
      socket.off("messageHistory");
      socket.off("messageResponse");
      socket.off("userConnected");
      socket.off("error");
      socket.off("userDisconnected");
    };
  }, []);
  //
  const contextValue = {
    socket,
    loginSocket: (accountID, username) => {
      if (accountID !== undefined) {
        socket.disconnect();
        socket.connect();

        socket.accountID = accountID;
        socket.username = username;
        

        socket.emit("connectSocket", { accountID, username });
      } else {
        
      }
    },
    logout: () => {
      socket.disconnect();
    },
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
}
