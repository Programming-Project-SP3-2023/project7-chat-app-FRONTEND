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
      // Your code to execute on refresh goes here
      // You can use this event to ask the user for confirmation
      console.log("handling unload scenario")
      //e.preventDefault();
      //e.returnValue = 'STOP! :P'; // This displays a browser-specific confirmation message
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

    //this was used to refresh the userlist, but it seems to have unintended consequences.
    /* const refreshInterval = setInterval(() => {
      if (showJoinOverlay) {
        getCurrentUsers();
      }
    }, 10000); */


    const peer = new Peer();

    peer.on('open', (id) => {
      setPeerId(id);
    });

    //listen for peers that are calling the user
    peer.on('call', (call) => {
      console.log("inside call now")

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
      console.log(connectionResponse);
    });

    //will receive a peerID whenever someone joins a channel you are in and calls them
    socket.on("userJoinVC", (user) => {
      console.log("user incoming");
      let newuser = {
        username: user.username.displayName,
        image: user.image,
        peerID: user.peerID
      }
      addUser(newuser);
      console.log("add user done")
      call(user.peerID);
      console.log("call done")

      let myPeerId = peer.id;
      console.log("sending my peer ID to socket " + myPeerId);
      socket.emit("callResponse", ({
        socketID: user.socketID,
        myPeerID: myPeerId
      }));
    });

    socket.on('callAnswered', ( response ) => {
      console.log("call answered, received peerID, calling " + response.peerID);
      call(response.peerID);
    })

    socket.on("error", (error) => {
      console.log(error);
    })

    socket.on("userLeftVC", ({ peerID }) => {
      console.log("user going " + peerID);
      releaseAudioElement(peerID);
      removeUser(peerID);
    })

    peerInstance.current = peer;

    setTimeout(2000);
    setLoading(false);

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', function(event) {
      // Your code to execute when the back button is clicked
      // You can access the event object for more details about the navigation
      console.log('Back button clicked');
      // Add your code here
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
      const index = availableAudioElements.findIndex((available, i) => !available && remoteAudioRefs.current[i].current === audioElement);
      if (index !== -1) {
      audioElement.srcObject = null;
      console.log("making element for peerID " + peerID + " available at element "+index)

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
    console.log("remoteCalls:")

    console.log(remoteCalls)
    //close the peer connection for each user.
    for (var i = 0; i < remoteCalls.length; i++) {
      console.log("closing call "+ i);
      remoteCalls[i].close();
    }
    for (var i = 0; i < remotePeers.length; i++) {
      console.log("dropping peer "+ i);
      releaseAudioElement(remotePeers[i]);
    }
    //clear the remote calls array
    remoteCalls.splice(0, remoteCalls.length);
  }



  const toggleSpeakingStatus = (peerID) => {
    setSpeakingStatus((prevStatus) => ({
      ...prevStatus,
      [peerID]: !prevStatus[peerID], // Toggle the status for the user
    }));
  };

  const handleJoinChannel = (channelID) => {

    console.log("Joining channel");
    
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
    // Handle the logic for joining the channel, e.g., navigating to the channel page
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
      console.log(err);
    }
  };


  const addUser = (newUser) => {
    console.log("does it do it here?")
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


  // Function to handle removing a user from the list
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
    // Get a random message from the array
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

  const playJoinSound = () =>{
    console.log("playing join")
    JoinSound.play();
  };

  const playLeaveSound = () => {
    console.log("playing leave")

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
              {console.log(user)}
              {(user && user.image) ? (
                <Avatar src={user.image} id="profile-avatar" />
              ) : (
                ""
              )}
              <span>{user.username} {user.peerID === peerId ? ' (Me!)' : ''} </span>
{/*               {user.peerID === peerId ?
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
              } */}
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