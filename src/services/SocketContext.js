import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";

//local host
const URL = "http://echo.matthewrosin.com:4000"; //

// prevent socket io auto connecting
const socket = io(URL);

// creating a socket context in order to use throughout app
const SocketContext = createContext();
// useContext allows the socket to be used
export function useSocket() {
  return useContext(SocketContext);
}

// wraps the components to allow use of the socket component
export function SocketProvider({ children }) {
  const [authData, setAuthData] = useState(null);

  useEffect(() => {
    if (authData) {
      //socket.auth = { token: authData.token };
    }
  }, [authData]);

  useEffect(() => {
    // listeners
    socket.on("connectionResponse", (response) => {
      console.log("Connection Response: ", response);
    });

    socket.on("onlineFriends", (friends) => {
      console.log("Online friends: ", friends);
    });

    // socket.on("messageHistory", (messages) => {
    //   console.log("Recieved message history: ", messages);
    // });

    // socket.on("messageResponse", (data) => {
    //   console.log("recieved message response", data);
    // });

    socket.on("userConnected", (userDetails) => {
      console.log("User Connected: ", userDetails);
    });

    socket.on("error", (error) => {
      console.log("error: ", error);
    });

    socket.on("userDisconnected", (userDetails) => {
      console.log("user disconnected", userDetails);
    });
  }, []);
  //
  const contextValue = {
    socket,
    authData,
    loginSocket: (accountID, username) => {
      socket.connect();

      console.log("accountID: " + accountID);
      console.log("username: " + username);

      socket.emit("connectSocket", { accountID, username });

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
