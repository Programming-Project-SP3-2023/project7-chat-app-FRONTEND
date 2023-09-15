/**
 * Side Menu component
 */

import { Drawer, ListItem, Box, List } from "@mui/material";
import GridViewIcon from "@mui/icons-material/GridView";
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ECHO_LOGO from "../../assets/echo_transparent.png";

/**
 * Builds and renders the side menu component
 * @returns Side Menu component render
 */
const SideMenu = ({ options, setSelectedOpt, selectedOpt }) => {
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
              onClick={() => setSelectedOpt(index)}
            >
              <div className="side-menu-img-container">
                {index === 0 && <GridViewIcon />}
                {index === 1 && <PeopleAltOutlinedIcon />}
                {index > 1 && <img src={ECHO_LOGO} alt={text} />}
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
