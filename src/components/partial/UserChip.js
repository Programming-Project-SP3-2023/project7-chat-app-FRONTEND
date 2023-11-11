/**
 * User Chip Item component
 */

import { Avatar } from "@mui/material";
import PersonRemoveAlt1OutlinedIcon from "@mui/icons-material/PersonRemoveAlt1Outlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CircleIcon from "@mui/icons-material/Circle";
import {
  acceptFriendRequest,
  removeFriendOrRequest,
} from "../../services/friendsAPI";

/**
 * Builds and renders the User Chip Item component
 * @returns User Chip Item component render
 */

const UserChip = ({ user, request, setRefresh, setManageFriendsModalOpen }) => {
  // Accept a friend request
  const acceptRequest = async () => {
    // 1. get userID
    let userID = user.RequesterID;
    
    console.log("THIS USER", user);
    console.log("Accepting request by ", userID);

    // 2. Send request to endpoint
    const response = await acceptFriendRequest(userID);
    console.log(response);

    // 3. notify user and refresh data
    alert("Friend accepted!");
    setRefresh(true);
    setManageFriendsModalOpen(false);
  };

  // Remove a friend
  const removeFriend = async () => {
    // 1. get userID
    let userID = "";
    if (user.RequesterID) userID = user.RequesterID;
    if (user.AddresseeID) userID = user.AddresseeID;
    console.log(userID);

    // 2. Send request to endpoint
    const response = await removeFriendOrRequest(userID);
    console.log(response);

    // 3. notify user and refresh data
    alert("Friend removed");
    setRefresh(true);
    setManageFriendsModalOpen(false);
  };

  return (
    <div className="user-chip" id={request && "friends-request"}>
      {user.notificationOn && <CircleIcon className="user-chip-notification" />}
      <Avatar
        className="user-chip-avatar"
        alt="Sample profile"
        src={user.Avatar}
      />
      <div className="user-chip-main">
        <span>{user.DisplayName}</span>
        {request ? (
          <>
            <h5>Friend request</h5>
            <span className="friend-request-icons">
              <DoneOutlinedIcon
                className="friend-request-accept"
                onClick={acceptRequest}
              />{" "}
              <CloseOutlinedIcon
                className="friend-request-refuse"
                onClick={removeFriend}
              />
            </span>
          </>
        ) : (
          <PersonRemoveAlt1OutlinedIcon
            className="remove-friends-icon"
            onClick={removeFriend}
          />
        )}
      </div>
    </div>
  );
};

//Export the User Chip Item component
export default UserChip;
