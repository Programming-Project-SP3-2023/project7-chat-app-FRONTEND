import React, { createContext, useContext, useEffect } from "react";
import { io } from "socket.io-client";

import { getUserByID } from "./userAPI";
import { getUser } from "../utils/localStorage";

// host
const URL = process.env.REACT_APP_BASEURL;
console.log("attempting to connect to ", URL);

// prevent socket io auto connecting
const socket = io(URL, { autoConnect: false });

// const authData = {
//   accountID: getUserByID(),
//   username: getUser().username(),
// };

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
      console.log("Connection Response: ", response);
    });

    socket.on("onlineFriends", (friends) => {
      console.log("Online friends: ", friends);
    });

    socket.on("messageHistory", (messages) => {
      console.log("Recieved message history: ", messages);
    });

    socket.on("messageResponse", (data) => {
      console.log("recieved message response", data);
    });

    socket.on("userConnected", (userDetails) => {
      console.log("User Connected: ", userDetails);
    });

    socket.on("error", (error) => {
      console.log("error: ", error);
    });

    socket.on("userDisconnected", (userDetails) => {
      console.log("user disconnected", userDetails);
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
    // authData,
    loginSocket: (accountID, username) => {
      if (accountID !== undefined) {
        socket.connect();

        socket.accountID = accountID;
        socket.username = username;
        console.log("accountID: " + accountID);
        console.log("username: " + username);

        socket.emit("connectSocket", { accountID, username });
      } else {
        console.log(
          "AccountID is undefined, Socket connection not established"
        );
      }

      if (socket.accountID === undefined) {
        console.log("undefined....");
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
