/**
 * Side Menu component
 */

import { Drawer, ListItem, Box, List } from "@mui/material";
import GridViewIcon from "@mui/icons-material/GridView";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ControlPointOutlinedIcon from "@mui/icons-material/ControlPointOutlined";

import { useNavigate } from "react-router-dom";

/**
 * Builds and renders the side menu component
 * @returns Side Menu component render
 */
const SideMenu = ({
  options,
  handleSelectOption,
  selectedOpt,
  setGroupModalOpen,
  groups,
}) => {
  const handleGroupModalOpen = () => setGroupModalOpen(true);
  const navigate = useNavigate();

  const handleNavigate = (index, options) => {
    if (index === 1) navigate("/dashboard/friends");
    if (index === 0) navigate("/dashboard");
    if (index !== options.length - 1 && index > 1) {
      groups.forEach((group) => {
        if (options[index] === group.groupName) {
          // loading group page with a certain ID (which will be used to get the group info)
          navigate(`/dashboard/groups/${group.groupID}`);
        }
      });
    }
  };

  console.log("CHECK OUT", options);

  return (
    <Drawer variant="permanent" id="side-menu">
      <Box sx={{ overflow: "auto", width: "100%", maxHeight:"82vh" }}>
          {options.map((text, index) => (
            <div
              key={text}
              className="side-menu-item"
              id={
                selectedOpt === index
                  ? "side-menu-item-selected"
                  : (index === selectedOpt - 1 && "side-menu-item-before") ||
                    (index === selectedOpt + 1 && "side-menu-item-after")
              }
              onClick={
                index === options.length - 1
                  ? () => handleGroupModalOpen()
                  : () => handleSelectOption(index)
              }
            >
              <div
                className="side-menu-img-container"
                onClick={() => handleNavigate(index, options)}
              >
                {index === 0 && <GridViewIcon />}
                {index === 1 && <PeopleAltOutlinedIcon />}
                {index === options.length - 1 && <ControlPointOutlinedIcon />}
                {index > 1 && index < options.length - 1 && (
                  <img
                    src={
                      groups[index - 2].groupAvatar
                        ? groups[index - 2].groupAvatar
                        : "https://images-platform.99static.com//n7liZzsSMdHX6uDJpYOA2QTUVeA=/163x13:1335x1185/fit-in/500x500/99designs-contests-attachments/116/116335/attachment_116335822"
                    }
                    alt={text}
                  />
                )}
              </div>
            </div>
          ))}
      </Box>
    </Drawer>
  );
};

//Export the side menu component
export default SideMenu;
