import React, { useState, useRef, useEffect } from 'react';
import Peer from 'peerjs';
import { useLocation } from 'react-router-dom';
import {
  Avatar
} from "@mui/material";
import { getUser } from '../../utils/localStorage'
import JoinFile from '../../assets/Join.wav'
import LeaveFile from '../../assets/Leave.wav'

const VoiceChatRoom = ({ socket }) => {
  const [speakingStatus, setSpeakingStatus] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showJoinOverlay, setShowJoinOverlay] = useState(false);
  const [isButtonDisabled, setButtonDisabled] = useState(true);
  const maxUsers = 6;
  const availableAudioElements = Array(maxUsers).fill(true);

  const [peerId, setPeerId] = useState('');
  const [remotePeers, setRemotePeers] = useState([]);
  const [remoteCalls, setRemoteCalls] = useState([]);
  //other users Peer IDs
  const remoteAudioRefs = useRef([]);
  const remoteAudioRef = useRef(null);
  //current user
  const peerInstance = useRef(null);
  const location = useLocation();
  const currentRoute = location.pathname;
  const route = currentRoute.split('/');
  const channelID = route[route.length - 1];
  const currentUser = getUser();

  //join and leave sound
  
  const [JoinSound] = useState(new Audio(JoinFile));
  const [LeaveSound] = useState(new Audio(LeaveFile));



  useEffect(() => {
    handleLeaveChannel(channelID);


    const handleBeforeUnload = (e) => {
      closeCalls();
      clearTimeout(timeoutId);
      handleLeaveChannel(channelID);
    };


    setButtonDisabled(true);
    const timeoutId = setTimeout(() => {
      setButtonDisabled(false);
    }, 2000);
    setShowJoinOverlay(true);
    setLoading(true);
    remoteAudioRefs.current = Array.from({ length: 12 }, () => React.createRef());


    async function getCurrentUsers() {
      socket.on("currentUsers", (users) => {
        let currusers = [];
        if (users) {
          for (let i = 0; i < users.length; i++) {
            let user = {
              username: users[i].username.displayName,
              peerID: users[i].peerID,
              image: users[i].image,
            }
            currusers.push(user);
          }
        }
        setUsers(currusers);
      });

      socket.emit("getCurrentUsers", { channelID: channelID });
    }

    getCurrentUsers();


    const peer = new Peer();

    peer.on('open', (id) => {
      setPeerId(id);
    });

    //listen for peers that are calling the user
    peer.on('call', (call) => {

      var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      const remotePeerId = call.peer;
      addRemotePeer(remotePeerId);
      addRemoteCall(call);

      getUserMedia({ video: false, audio: true }, (mediaStream) => {
        call.answer(mediaStream)
        call.on('stream', function (remoteStream) {
          assignRemoteStreamToAudio(remoteStream, remotePeerId);
        });
      });
    })

    //socket handlers

    socket.on("connectionResponse", ({ connectionResponse }) => {
    });

    //will receive a peerID whenever someone joins a channel you are in and calls them
    socket.on("userJoinVC", (user) => {
      let newuser = {
        username: user.username.displayName,
        image: user.image,
        peerID: user.peerID
      }
      addUser(newuser);
      call(user.peerID);

      let myPeerId = peer.id;
      socket.emit("callResponse", ({
        socketID: user.socketID,
        myPeerID: myPeerId
      }));
    });

    socket.on('callAnswered', ( response ) => {
      call(response.peerID);
    })

    socket.on("error", (error) => {
    })

    socket.on("userLeftVC", ({ peerID }) => {
      releaseAudioElement(peerID);
      removeUser(peerID);
    })

    peerInstance.current = peer;

    setTimeout(2000);
    setLoading(false);

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', function(event) {

    });
    return () => {
      socket.off("userLeftVC");
      socket.off("error");
      socket.off('callAnswered');
      socket.off("userJoinVC");
      socket.off("connectionResponse");
      peer.off('call');
      peer.off('open');
      socket.off("currentUsers");
      handleLeaveChannel(channelID);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };

  }, [channelID]);

  const isRoomFull = users.length >= maxUsers;



  const assignRemoteStreamToAudio = (remoteStream, peerID) => {
    const index = availableAudioElements.findIndex((available) => available);

    if (index !== -1) {
      const audioElement = remoteAudioRefs.current[index].current;
      audioElement.srcObject = remoteStream;

      // Mark the audio element as unavailable
      availableAudioElements[index] = false;

      audioElement.setAttribute('data-audio-id', peerID);
    }
    else {

    }
  };

  const releaseAudioElement = (peerID) => {
    const audioElement = document.querySelector(`[data-audio-id="${peerID}"]`);

    if (audioElement) {
      const index = availableAudioElements.findIndex((available, i) => !available && remoteAudioRefs.current[i].current === audioElement);
      if (index !== -1) {
      audioElement.srcObject = null;

      // Mark the audio element as available
      availableAudioElements[index] = true;
      }
    }
  };

  const renderMediaRefs = () => {
    return remoteAudioRefs.current.map((audioRef, index) => (
      <audio key={index} ref={audioRef} autoPlay />
    ));
  }

  //call peeps
  const call = (remotePeerId) => {
    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    getUserMedia({ video: false, audio: true }, (mediaStream) => {
      const call = peerInstance.current.call(remotePeerId, mediaStream);
    });
  }

  //close connections with all users in the room
  const closeCalls = () => {

    //close the peer connection for each user.
    for (var i = 0; i < remoteCalls.length; i++) {
      remoteCalls[i].close();
    }
    for (var i = 0; i < remotePeers.length; i++) {
      releaseAudioElement(remotePeers[i]);
    }
    //clear the remote calls array
    remoteCalls.splice(0, remoteCalls.length);
  }


  const handleJoinChannel = (channelID) => {

    
    let myUser = {
      username: currentUser.username.displayName,
      peerID: peerId,
      image: currentUser.image
    }
    addUser(myUser);

    socket.emit("joinVC", {
      channelID: channelID,
      peerID: peerId,
      image: currentUser.image
    })
    socket.emit("getCurrentUsers", { channelID: channelID });
    setTimeout("2000");

    setShowJoinOverlay(false);
  };

  const handleLeaveButton = (channelID) => {
    playLeaveSound();
    handleLeaveChannel(channelID);
  };

  const handleLeaveChannel = (channelID) => {
    try{

    closeCalls();
    socket.emit("leaveVC", { channelID: channelID });
    //remove my own user to disappear
    removeUser(peerId);
    setShowJoinOverlay(true);
    }
    catch(err){
    }
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
    playJoinSound();
  };


  const addRemoteCall = (remoteCall) => {
    setRemoteCalls((prevCalls) => {
      if (!prevCalls) {
        return [remoteCall];
      } else {
        return [...prevCalls, remoteCall];
      }
    });
  };

  const addRemotePeer = (peerID) => {
    setRemotePeers((prevPeers) => {
      if (!prevPeers) {
        return [peerID];
      } else {
        return [...prevPeers, peerID];
      }
    });
  };


  const removeUser = (peerID) => {
    if(peerID != peerId){
      playLeaveSound();
    }
    setUsers((prevUsers) => prevUsers.filter((user) => user.peerID !== peerID));
  };

  const overlayMessages = [
    "It's just not the same without you! Click to join.",
    "What are you waiting for? The channel isn't going to join itself!",
    "Ready to chat? Join now!",
    "You've been summoned! Click to join the channel."

  ];

  const getRandomMessage = () => {
    // Get a random message from the array
    if(!isButtonDisabled){
    const randomIndex = Math.floor(Math.random() * overlayMessages.length);
    return overlayMessages[randomIndex];
    }
    else{
      return "";
    }
  };

  const fullOverlayMessages = [
    "Sorry, channel is full. No room for you!",
    "Ah, shoot... no room in this one.",
    "My boss will fire me if I let any more in here. Sorry. (Channel full)",
    "You're fashionably late, but the channel is fashionably full!"
  ];

  const getRandomFullMessage = () => {
    if(!isButtonDisabled){
    const randomIndex = Math.floor(Math.random() * fullOverlayMessages.length);
    return fullOverlayMessages[randomIndex];
    }
    else{
      return "";
    }
  };

  const getOverlayMessage = () => {
    return isRoomFull ? getRandomFullMessage() : getRandomMessage();
  };

  const playJoinSound = () =>{
    JoinSound.play();
  };

  const playLeaveSound = () => {

    LeaveSound.play()
  };



  return (
    <div className="voice-chat-room">
      <audio hidden></audio>
      {showJoinOverlay && (
        <div className="join-overlay">
          <div className="join-content">
            <h2>Join Channel?</h2>
            <p className="overlay-message">{getOverlayMessage()}</p>
            {isRoomFull ? (
              <button 
              disabled={true}
              >
                {isButtonDisabled ? 
                <p>Connecting</p>
                : 
                <p>Sorry :(</p>
                }</button>
            ) : (
              <button 
              disabled={isButtonDisabled}
              onClick={() => handleJoinChannel(channelID)}>
                {isButtonDisabled ? 
                <p>Connecting</p>
                : 
                <p>Join</p>
                }</button>
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
            >
              {(user && user.image) ? (
                <Avatar src={user.image} id="profile-avatar" />
              ) : (
                ""
              )}
              <span>{user.username} {user.peerID === peerId ? ' (Me!)' : ''} </span>

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
            handleLeaveButton(channelID);
          }}
        >
          Leave
        </button>
      )}
    </div>
  );
};

export default VoiceChatRoom;