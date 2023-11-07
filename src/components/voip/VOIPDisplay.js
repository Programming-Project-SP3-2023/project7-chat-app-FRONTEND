import React, { useState, useRef, useEffect } from 'react';
import { useSocket } from "../../services/SocketContext";
import Peer from 'peerjs';
import webRTCAdapter_import from "webrtc-adapter"



const VoiceChatRoom = ({socket}) => {
  const [speakingStatus, setSpeakingStatus] = useState({});
  const [users, setUsers] = useState([]);
  const [showJoinOverlay, setShowJoinOverlay] = useState(false);
  const maxUsers = 36;

  useEffect(() => {

    const peer = new Peer();

    let currentUsers = [
      {

      }
    ]
    
    peer.on('open', (id) => {
      setPeerId(id);
    });

    //listen for peers that are calling the user
    peer.on('call', (call) => {
      var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      const remotePeerId = call.peer;
      setRemotePeers((prevPeers) => [...prevPeers, remotePeerId]);
      setRemoteCalls((prevCalls) => [...prevCalls, call]);

      getUserMedia({ video: false, audio: true }, (mediaStream) => {
        call.answer(mediaStream)
        call.on('stream', function(remoteStream) {
          remoteAudioRef.current.srcObject = remoteStream
          remoteAudioRef.current.play();
        });
      });
    })

    peerInstance.current = peer;


    setUsers(currentUsers)
    setShowJoinOverlay(true);

  }, []); // Empty dependency array ensures it runs once on component mount

  const isRoomFull = users.length >= maxUsers;
















  socket.on("connectionResponse", (connectionResponse) => {
    console.log(connectionResponse);
  });

  //will receive a peerID whenever someone joins a channel you are in and calls them
  socket.on("userJoinVC", (user) => {
    console.log(user);
    let newUser = [{
      username: user.username,
      peerID: user.peerID,
      profilePicture: "https://wallpapers.com/images/hd/funny-pictures-dzujtlgoq3utq7j4.jpg"
    }]
    addUser(newUser);
    call(newUser.peerID);
  });

  socket.on("error", () => {
    console.log("error");
  })

  socket.on("userLeftVC", (peerID) => {
    closeCall(peerID);
  })

  const [peerId, setPeerId] = useState('');
  const [remotePeers, setRemotePeers] = useState([]);
  const [remoteCalls, setRemoteCalls] = useState([]);
  //other users Peer IDs
  const remoteAudioRefs = useRef({});
  const remoteAudioRef = useRef(null);
  //current user
  const peerInstance = useRef(null);

  // join a VC
  const joinVC = (ChannelID, peerId) => {
    console.log(ChannelID);
    //joins you to the VC, server will check if you have access and will throw error if it fails
    socket.emit("joinVC", ChannelID, );
  }

//call peeps
const call = (remotePeerId) => {
  var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

  setRemotePeers((prevPeers) => [...prevPeers, remotePeerId]);

  getUserMedia({ video: false, audio: true }, (mediaStream) => {
    const call = peerInstance.current.call(remotePeerId, mediaStream);
    setRemoteCalls((prevCalls) => [...prevCalls, call]);
    
    console.log(call);
    call.on('stream', (remoteStream) => {
      remoteAudioRef.current.srcObject = remoteStream
      remoteAudioRef.current.play();
    });
  });
}

//close connections with all users in the room
const closeCalls = (ChannelID) => {
  //emit to other users that the user is leaving the channel
  socket.emit("leaveVC", ChannelID);

  //close the peer connection for each user.
  for(var i=0; i<remoteCalls.length; i++){
    remoteCalls[i].close();
  }
  //clear the remote calls array
  remoteCalls.splice(0, remoteCalls.length);
}

// close a connection with a specific user
const closeCall = (peerID) => {
  console.log(peerID);
  for(var i=0; i<remoteCalls.length; i++){
    if(remoteCalls[i].peer = peerID){
      console.log("removed: " + peerID);
      remoteCalls[i].close();
      remoteCalls.splice(i, 1);
    }
  }
}























  const toggleSpeakingStatus = (userId) => {
    setSpeakingStatus((prevStatus) => ({
      ...prevStatus,
      [userId]: !prevStatus[userId], // Toggle the status for the user
    }));
  };
  
  const handleJoinChannel = (channelID) => {
    console.log("Joining channel");
    socket.emit("joinVC", channelID, peerId)
    setShowJoinOverlay(false);
    // Handle the logic for joining the channel, e.g., navigating to the channel page
  };


  const addUser = (newUser) => {
    console.log("adding new user");
    setUsers((prevUsers) => [...prevUsers, newUser]);
    console.log(users.length);
  };

   // Function to get the current users from a socket.io call
   const getCurrentUsers = () => {

   };


  // Function to handle removing a user from the list
  const removeUserFromUserList = (userId) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  };

  const overlayMessages = [
    "It's just not the same without you! Click to join.",
    "What are you waiting for? The channel isn't going to join itself!",
    "Ready to chat? Join now!",
    "C'mon... just one click. I NEED it...",
  ];

  const getRandomMessage = () => {
    // Get a random message from the array
    const randomIndex = Math.floor(Math.random() * overlayMessages.length);
    return overlayMessages[randomIndex];
  };

  const fullOverlayMessages = [
    "Sorry, channel is full. No room for you!",
    "Ah, shoot... no room in this one.",
    "Sorry champ, you ain't getting in here. Channel full.",
    "This channel ain't big enough fer the both of us!"
  ];

  const getRandomFullMessage = () => {
    // Get a random message from the array
    const randomIndex = Math.floor(Math.random() * fullOverlayMessages.length);
    return fullOverlayMessages[randomIndex];
  };

  const getOverlayMessage = () => {
    return isRoomFull ? getRandomFullMessage() : getRandomMessage();
  };

  return (
    <div className="voice-chat-room">
      {showJoinOverlay && (
        <div className="join-overlay">
          <div className="join-content">
            <h2>{isRoomFull ? "Oops!" : "Join Channel?"}</h2>
            <p>{getOverlayMessage()}</p>
            {isRoomFull ? (
              <p>Pick a different channel.</p>
            ) : (
              <button onClick={() => handleJoinChannel(10)}>Join</button>
            )}
          </div>
        </div>
      )}

      <div className="user-grid">
        {users.map((user) => (
          <div
            key={user.peerID}
            className={`user-square ${speakingStatus[user.peerID] ? 'speaking' : ''}`}
            onClick={() => toggleSpeakingStatus(user.peerID)}
          >
            <img src={user.profilePicture} alt={`${user.username}'s profile`} />
            <span>{user.username}</span>
            <div>
              <audio ref={remoteAudioRef}></audio>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoiceChatRoom;