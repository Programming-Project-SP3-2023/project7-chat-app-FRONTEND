/**
 * Member Chip Item component
 */

import { Avatar } from "@mui/material";
import PersonRemoveAlt1OutlinedIcon from "@mui/icons-material/PersonRemoveAlt1Outlined";

/**
 * Builds and renders the Member Chip Item component
 * @returns Member Chip Item component render
 */

const MemberChip = ({ member, setRefresh, setManageMemberModalOpen }) => {
  // Add a new member
  const addMember = () => {
    console.log("adding member...");
  };

  // Remove a member
  const removeMember = () => {
    console.log("removing member");
  };

  return (
    <div className="user-chip">
      <Avatar
        className="user-chip-avatar"
        alt="Sample profile"
        src={member.avatar}
      />
      <div className="user-chip-main">
        <span>{member.MemberName}</span>
        <PersonRemoveAlt1OutlinedIcon
          className="remove-friends-icon"
          onClick={removeMember}
        />
      </div>
    </div>
  );
};

//Export the Member Chip Item component
export default MemberChip;
