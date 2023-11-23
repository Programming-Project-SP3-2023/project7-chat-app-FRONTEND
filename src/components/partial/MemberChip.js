/**
 * Member Chip Item component
 */

import { Avatar } from "@mui/material";
import PersonRemoveAlt1OutlinedIcon from "@mui/icons-material/PersonRemoveAlt1Outlined";
import { getUserID } from "../../utils/localStorage";
/**
 * Builds and renders the Member Chip Item component
 * @returns Member Chip Item component render
 */

const MemberChip = ({
  member,
  setRefresh,
  setManageMemberModalOpen,
  handleRemoveMember,
}) => {
  const userID = getUserID();
  return (
    <div className="user-chip">
      <Avatar
        className="user-chip-avatar"
        alt="Sample profile"
        src={member.avatar}
      />
      <div className="user-chip-main">
        <span>{member.MemberName}</span>
        {/* based on that the user is the admin and should not be able to remove himself */}
        {userID !== member.AccountID && (
          <PersonRemoveAlt1OutlinedIcon
            className="remove-friends-icon"
            onClick={handleRemoveMember}
          />
        )}
      </div>
    </div>
  );
};

//Export the Member Chip Item component
export default MemberChip;
