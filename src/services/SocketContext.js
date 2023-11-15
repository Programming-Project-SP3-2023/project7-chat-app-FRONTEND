import React, { createContext, useContext, useEffect } from "react";
import { io } from "socket.io-client";

// host
const URL = process.env.REACT_APP_BASEURL;

console.log("attempting to connect to ", URL);

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
      console.log("Connection Response: ", response);
    });

    socket.on("onlineFriends", (friends) => {
      console.log("Online friends: ", friends);
    });

    socket.on("messageHistory", (messages) => {
      console.log("Recieved message history: ", messages);
    });

    socket.on("messageResponse", (data) => {
      console.log("recieved message response: ", data);
    });

    socket.on("userConnected", (userDetails) => {
      console.log("User Connected: ", userDetails);
    });

    socket.on("error", (error) => {
      console.log("error: ", error);
    });

    socket.on("userDisconnected", (userDetails) => {
      console.log("user disconnected: ", userDetails);
    });

    socket.on("connectGroupResponse", (groupResponse) => {
      console.log("Group Connect response", groupResponse);
    });

    socket.on("connectChannelResponse", (channelResponse) => {
      console.log("channel connect response: ", channelResponse);
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
        // console.log("accountID: " + accountID);
        // console.log("username: " + username);

        socket.emit("connectSocket", { accountID, username });
      } else {
        console.log(
          "AccountID is undefined, Socket connection not established"
        );
      }
    },
    logout: () => {
      socket.disconnect();
    },
    // reconnect: (userID, user) => {
    //   // if (!socket.connected) {
    //   //   socket.connect();
    //   // }

    //   if (userID !== undefined) {
    //     console.log("attempting to reconnect");
    //     socket.accountID = userID;
    //     socket.username = user;
    //     socket.emit("connectSocket", { accountID: userID, username: user });
    //   } else {
    //     console.log("cannot reconnect please relog in....");
    //   }
    // },
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
}
