/**
 * Side Menu component
 */

import { Drawer, ListItem, Box, List } from "@mui/material";
import { useState } from "react";
import GridViewIcon from "@mui/icons-material/GridView";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ControlPointOutlinedIcon from "@mui/icons-material/ControlPointOutlined";
import ECHO_LOGO from "../../assets/echo_transparent.png";

/**
 * Builds and renders the side menu component
 * @returns Side Menu component render
 */
const SideMenu = ({ options, setSelectedOpt, selectedOpt, groupModalOpen, setGroupModalOpen }) => {
  
  const handleGroupModalOpen = () => setGroupModalOpen(true);

  return (
    <Drawer variant="permanent" id="side-menu">
      <Box sx={{ overflow: "auto", width: "100%" }}>
        <List>
          {options.map((text, index) => (
            <ListItem
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
                  : () => setSelectedOpt(index)
              }
            >
              <div className="side-menu-img-container">
                {index === 0 && <GridViewIcon />}
                {index === 1 && <PeopleAltOutlinedIcon />}
                {index === options.length - 1 && <ControlPointOutlinedIcon />}
                {index > 1 && index < options.length - 1 && (
                  <img src={ECHO_LOGO} alt={text} />
                )}
              </div>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

//Export the side menu component
export default SideMenu;
