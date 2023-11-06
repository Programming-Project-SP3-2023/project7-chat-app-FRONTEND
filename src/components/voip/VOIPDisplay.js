import React, { useState, useEffect } from 'react';

const VoiceChatRoom = () => {
  const [speakingStatus, setSpeakingStatus] = useState({});
  const [users, setUsers] = useState([]);

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
    setUsers(testUsers);
  }, []); // Empty dependency array ensures it runs once on component mount

  const toggleSpeakingStatus = (userId) => {
    setSpeakingStatus((prevStatus) => ({
      ...prevStatus,
      [userId]: !prevStatus[userId], // Toggle the status for the user
    }));
  };

  const addUser = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
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
    </div>
  );
};

export default VoiceChatRoom;