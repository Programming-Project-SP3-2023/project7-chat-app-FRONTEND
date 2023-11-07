import React, { useState, useEffect } from 'react';
import { useSocket } from "../../services/SocketContext";


const VoiceChatRoom = ({socket}) => {
  const [speakingStatus, setSpeakingStatus] = useState({});
  const [users, setUsers] = useState([]);
  const [showJoinOverlay, setShowJoinOverlay] = useState(false);


  useEffect(() => {
    let testUsers = [
      {
        username: "Richard Hippopotomous",
        profilePicture: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuxP2c3L7G6YnNzHwmn7K8W4UWUkcnh9RNMw&usqp=CAU",
        id: 1001
      },
      {
        username: "Adrian Whogivesadamn",
        profilePicture: "https://i.pinimg.com/originals/d2/4b/be/d24bbe79387549086d159aa4462bf4c9.png",
        id: 1002
      }
    ];
    //getCurrentUsers();

    socket.on("userJoinVC", (user) => {

    });

    socket.on("userLeftVC", (user) => {

    });

    setShowJoinOverlay(true);

    setUsers(testUsers);
  }, []); // Empty dependency array ensures it runs once on component mount

  const toggleSpeakingStatus = (userId) => {
    setSpeakingStatus((prevStatus) => ({
      ...prevStatus,
      [userId]: !prevStatus[userId], // Toggle the status for the user
    }));
  };
  
  const handleJoinChannel = () => {
    console.log("Joining channel");
    setShowJoinOverlay(false);
    // Handle the logic for joining the channel, e.g., navigating to the channel page
  };

  const addUser = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
  };

   // Function to get the current users from a socket.io call
   const getCurrentUsers = () => {
    // Call your socket.io method to get the current users
    // This function should populate the users array with the received data
    // For example: socket.emit('getUsers', (data) => setUsers(data));
  };

  // Function to handle removing a user from the list
  const removeUserFromUserList = (userId) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  };

  return (
    <div className="voice-chat-room">
      {users.map((user) => (
        <div
          key={user.id}
          className={`user-square ${speakingStatus[user.id] ? 'speaking' : ''}`}
          onClick={() => toggleSpeakingStatus(user.id)}
        >
          <img src={user.profilePicture} alt={`${user.username}'s profile`} />
          <span>{user.username}</span>
        </div>
      ))}
      {showJoinOverlay && (
        <div className="join-overlay">
          <div className="join-content">
            <h2>Join This Channel</h2>
            <p>Preview who's in the channel and decide if you want to join.</p>
            <button onClick={handleJoinChannel}>Join</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceChatRoom;