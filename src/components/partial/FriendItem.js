/**
 * Friend Label Item component
 */

import { Avatar } from "@mui/material";
import CircleIcon from '@mui/icons-material/Circle';

// PICS FOR TESTING **
import SAMPLE_PIC_1 from "../../assets/sample-pic.jpeg";
// import SAMPLE_PIC_2 from "../../assets/sample-pic-2.jpeg";

/**
 * Builds and renders the Friend Label Item component
 * @returns Friend Label Item component render
 */

const FriendItem = ({ friend }) => {
  // TODO - friend profile pic for Avatar component should come from the friend object (API call)

  return (
    <div className="friend-menu-item">
      <Avatar
        className="menu-item-avatar"
        alt="Sample profile"
        src={SAMPLE_PIC_1}
      />
      <div>
        <div className="friend-item-header">
          <span>{friend.name}</span>
          <span><CircleIcon /></span>
        </div>
        <div className="friend-item-message">
          {!friend.lastSent && "Me: "}
          {friend.lastMessage ? friend.lastMessage : "..."}
        </div>
      </div>
    </div>
  );
};

//Export the Friend Label Item component
export default FriendItem;
