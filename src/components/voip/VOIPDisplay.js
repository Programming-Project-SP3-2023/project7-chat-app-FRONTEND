import React, { useState, useRef, useEffect } from 'react';
import { useSocket } from "../../services/SocketContext";
import Peer from 'peerjs';
import webRTCAdapter_import from "webrtc-adapter"
import { useLocation } from 'react-router-dom';
import {
  Avatar
} from "@mui/material";
import { getUser } from '../../utils/localStorage'


const VoiceChatRoom = ({ socket }) => {
  const [speakingStatus, setSpeakingStatus] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showJoinOverlay, setShowJoinOverlay] = useState(false);
  const maxUsers = 12;
  const availableAudioElements = Array(maxUsers).fill(true);

  const [peerId, setPeerId] = useState('');
  const [remotePeers, setRemotePeers] = useState([]);
  const [remoteCalls, setRemoteCalls] = useState([]);
  //other users Peer IDs
  const remoteAudioRefs = useRef([]);
  const remoteAudioRef = useRef(null);
  //current user
  const peerInstance = useRef(null);
  let currentVC = null;
  const location = useLocation();
  const currentRoute = location.pathname;
  const route = currentRoute.split('/');
  const channelID = route[route.length - 1];
  const currentUser = getUser();


  useEffect(() => {


    setShowJoinOverlay(true);
    remoteAudioRefs.current = Array.from({ length: 12 }, () => React.createRef());


    async function getCurrentUsers() {
      socket.on("currentUsers", (users) => {
        let currusers = [];
        if (users) {
          for (let i = 0; i < users.length; i++) {
            let user = {
              username: users[i].username,
              peerID: users[i].peerID,
              image: users[i].image,
            }
            currusers.push(user);
          }
        }
        console.log(currusers);
        setUsers(currusers);
        setLoading(false);
      });

      socket.emit("getCurrentUsers", { channelID: 10 });
    }

    getCurrentUsers();


    const refreshInterval = setInterval(() => {
      console.log("show overlay is " + showJoinOverlay);
      if (showJoinOverlay) {
        getCurrentUsers();
      }
    }, 10000);


    const peer = new Peer();

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
        call.on('stream', function (remoteStream) {
          assignRemoteStreamToAudio(remoteStream, remotePeerId);
        });
      });
    })

    //socket handlers

    socket.on("connectionResponse", ({ connectionResponse }) => {
      console.log(connectionResponse);
    });

    //will receive a peerID whenever someone joins a channel you are in and calls them
    socket.on("userJoinVC", (user) => {
      console.log("user incoming");
      let newuser = {
        username: user.username,
        image: user.image,
        peerID: user.peerID
      }
      addUser(newuser);
      call(user.peerID);
      let myPeerId = peer.id;
      console.log("calling " + user.peerID);
      console.log("sending my peer ID to socket " + myPeerId);
      socket.emit("callResponse", ({
        socketID: user.socketID,
        myPeerID: myPeerId
      }));
    });

    socket.on('callAnswered', ({ peerID }) => {
      console.log("call answered, received peerID, calling " + peerID);
      call(peerID);
    })

    socket.on("error", () => {
      console.log("error");
    })

    socket.on("userLeftVC", ({ peerID }) => {
      console.log("user going " + peerID);
      closeCall(peerID);
      removeUser(peerID);
    })

    peerInstance.current = peer;

    return () => {
      if (currentVC) {
        handleLeaveChannel(currentVC);
      }
    };

  }, []);

  const isRoomFull = users.length >= maxUsers;

  const getPeerID = () => {
    return peerId;
  }

  const assignRemoteStreamToAudio = (remoteStream, peerID) => {
    const index = availableAudioElements.findIndex((available) => available);

    if (index !== -1) {
      console.log("There is an available element at index " + index)
      const audioElement = remoteAudioRefs.current[index].current;
      audioElement.srcObject = remoteStream;

      // Mark the audio element as unavailable
      availableAudioElements[index] = false;

      audioElement.setAttribute('data-audio-id', peerID);
    }
    else {
      console.log("There is no avail element");

    }
  };

  const releaseAudioElement = (peerID) => {
    const audioElement = document.querySelector(`[data-audio-id="${peerID}"]`);

    if (audioElement) {
      const index = availableAudioElements.findIndex((available, i) => !available && remoteAudioRefs[i].current === audioElement);
      audioElement.srcObject = null;
      console.log("making element for peerID " + peerID + " available")

      // Mark the audio element as available
      availableAudioElements[index] = true;
    }
  };

  const renderMediaRefs = () => {
    return remoteAudioRefs.current.map((audioRef, index) => (
      <audio key={index} ref={audioRef} autoPlay controls />
    ));
  }

  //call peeps
  const call = (remotePeerId) => {
    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    setRemotePeers((prevPeers) => [...prevPeers, remotePeerId]);

    getUserMedia({ video: false, audio: true }, (mediaStream) => {
      const call = peerInstance.current.call(remotePeerId, mediaStream);
      setRemoteCalls((prevCalls) => [...prevCalls, call]);
    });
  }

  //close connections with all users in the room
  const closeCalls = (ChannelID) => {
    //emit to other users that the user is leaving the channel

    //close the peer connection for each user.
    for (var i = 0; i < remoteCalls.length; i++) {
      remoteCalls[i].close();
    }
    //clear the remote calls array
    remoteCalls.splice(0, remoteCalls.length);
  }

  // close a connection with a specific user
  const closeCall = (peerID) => {
    console.log(peerID);
    console.log(remoteCalls.length);

    for (var i = 0; i < remoteCalls.length; i++) {
      console.log(remoteCalls[i].peer);
      if (remoteCalls[i].peer === peerID) {
        console.log("removed: " + peerID);
        remoteCalls[i].close();
        remoteCalls.splice(i, 1);
        releaseAudioElement(peerID);
      }
    }
  }


  const toggleSpeakingStatus = (peerID) => {
    setSpeakingStatus((prevStatus) => ({
      ...prevStatus,
      [peerID]: !prevStatus[peerID], // Toggle the status for the user
    }));
  };

  const handleJoinChannel = (channelID) => {
    console.log("Joining channel");
    //remove overlay
    setShowJoinOverlay(false);
    let myUser = {
      username: "Me!",
      peerID: peerId,
      image: currentUser.image
    }
    addUser(myUser);

    socket.emit("joinVC", {
      channelID: channelID,
      peerID: peerId,
      image: currentUser.image
    })
    currentVC = channelID;
    socket.emit("getCurrentUsers", { channelID: 10 });
    console.log(currentVC);
    // Handle the logic for joining the channel, e.g., navigating to the channel page
  };

  const handleLeaveChannel = (channelID) => {


    socket.emit("leaveVC", { channelID: channelID });
    //remove my own user to disappear
    removeUser(peerId);
    setShowJoinOverlay(true);

  };


  const addUser = (newUser) => {
    setUsers((prevUsers) => {
      if (!prevUsers) {
        // If the users array is empty, initialize it with the new user
        return [newUser];
      } else {
        // If the users array is not empty, add the new user to the existing array
        return [...prevUsers, newUser];
      }
    });
  };


  // Function to handle removing a user from the list
  const removeUser = (peerID) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.peerID !== peerID));
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

  // Function to handle audio play/pause events
  const handleAudioPlayPause = (userId, isPlaying) => {
    if (isPlaying) {
      // Audio is playing, indicating the user is speaking
      toggleSpeakingStatus(userId);
    } else {
      // Audio is paused, indicating the user is not speaking
      toggleSpeakingStatus(userId);
    }
  };

  // Function to handle audio ended event
  const handleAudioEnded = (userId) => {
    // Audio has ended, indicating the user is not speaking
    toggleSpeakingStatus(userId);
  };

  const handleVolumeChange = (event) => {
    console.log("changing vol");
    console.log(event.target.value);
    const audio = remoteAudioRef;
    if (audio) {
      audio.volume = event.target.value;
    }
  };

  return (
    <div className="voice-chat-room">
      <p>{channelID}</p>
      {showJoinOverlay && (
        <div className="join-overlay">
          <div className="join-content">
            <h2>{isRoomFull ? "Oops!" : "Join Channel?"}</h2>
            <p className="overlay-message">{getOverlayMessage()}</p>
            {isRoomFull ? (
              <p>Pick a different channel.</p>
            ) : (
              <button onClick={() => handleJoinChannel(10)}>Join</button>
            )}
          </div>
        </div>
      )}

      <div className="user-grid">
        {users && users.length > 0 ? (
          users.map((user) => (
            <div
              key={user.peerID}
              className={`user-square ${speakingStatus[user.peerID] ? 'speaking' : ''}`}
              onClick={() => toggleSpeakingStatus(user.peerID)}
            >
              {console.log(user)}
              {console.log(currentUser.image)
              }
              {(user && user.image) ? (
                <Avatar src={user.image} id="profile-avatar" />
              ) : (
                ""
              )}
              <span>{user.username} {user.peerID === peerId ? ' (Me!)' : ''} </span>
              {user.peerID === peerId ?
                <input type="hidden"></input>
                :
                <input
                  className="user-audio-slider"
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={remoteAudioRef.volume || 1}
                  onChange={(e) => handleVolumeChange(e)}
                />
              }
              <div>
              </div>
            </div>

          ))
        ) : (
          <p>No one's here right now.. jump in?</p>
        )}
      </div>
      <div>
        {renderMediaRefs()}
      </div>
      {showJoinOverlay ? (
        <p></p>
      ) : (
        <button
          className="leave-button"
          onClick={() => {
            handleLeaveChannel(10);
          }}
        >
          Leave
        </button>
      )}
    </div>
  );
};

export default VoiceChatRoom;