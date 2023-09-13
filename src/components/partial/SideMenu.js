/**
 * Side Menu component
 */

import { Drawer, ListItem, ListItemIcon, Box, List } from "@mui/material";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

/**
 * Builds and renders the side menu component
 * @returns Side Menu component render
 */
const SideMenu = ({groups, setSelectedGroup, selectedGroup}) => {

  return (
    <Drawer variant="permanent" id="side-menu">
      <Box sx={{ overflow: "auto", width: "100%" }}>
        <List>
          {groups.map((text, index) => (
            <ListItem
              key={text}
              id={
                selectedGroup === index
                  ? "side-menu-item-selected"
                  : "side-menu-item"
              }
              onClick={() => setSelectedGroup(index)}
            >
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

//Export the side menu component
export default SideMenu;
