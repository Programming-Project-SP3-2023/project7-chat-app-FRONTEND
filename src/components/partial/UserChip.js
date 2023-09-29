/**
 * User Chip Item component
 */

import { Avatar } from "@mui/material";
import PersonRemoveAlt1OutlinedIcon from "@mui/icons-material/PersonRemoveAlt1Outlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

// PICS FOR TESTING **
import SAMPLE_PIC_1 from "../../assets/sample-pic.jpeg";

/**
 * Builds and renders the User Chip Item component
 * @returns User Chip Item component render
 */

const UserChip = ({ user, request }) => {
  // TODO - friend profile pic for Avatar component should come from the friend object (API call)

  // TO IMPLEMENT - function to accept friend request
  const acceptRequest = () => {
    console.log("accepting request..")
  }

  // TO IMPLEMENT - function to refuse friend request
  const refuseRequest = () => {
    console.log("refusing request...");
  }

  // TO IMPLEMENT - function to remove friend 
  const removeFriend = () => {
    console.log("removing friend...")
  }

  return (
    <div className="user-chip" id={request && "friends-request"}>
      <Avatar
        className="user-chip-avatar"
        alt="Sample profile"
        src={SAMPLE_PIC_1}
      />
      <div className="user-chip-main">
        <span>{user.name}</span>
        {request ? (
          <>
            <h5>Friend request</h5>
            <span className="friend-request-icons">
              <DoneOutlinedIcon className="friend-request-accept" onClick={acceptRequest} />{" "}
              <CloseOutlinedIcon className="friend-request-refuse" onClick={refuseRequest} />
            </span>
          </>
        ) : (
          <PersonRemoveAlt1OutlinedIcon className="remove-friends-icon" onClick={removeFriend} />
        )}
      </div>
    </div>
  );
};

//Export the User Chip Item component
export default UserChip;
