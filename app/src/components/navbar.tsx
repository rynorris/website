import * as React from "react";
import { map, zip } from "lodash";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import MenuIcon from "@material-ui/icons/Menu";
import Paper from "@material-ui/core/Paper";

import {Toolbar, ToolbarGroup} from "material-ui/Toolbar";

interface INavbarProps {
  links: string[];
  titles: string[];
  fixed?: boolean;
}

export const Navbar: React.SFC<INavbarProps> = props => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const { links, titles, fixed } = props;

  let navItems = map(zip(links, titles), (item: string[], ix: number) => (
      <Link key={"nav-item-" + ix} to={item[0]}>
        <Button>{item[1]}</Button>
      </Link>
  ));

  let drawerItems = map(zip(links, titles), (item: string[], ix: number) => (
      <Link key={"drawer-item-" + ix} to={item[0]}>
        <MenuItem onClick={() => setDrawerOpen(false)}>
          {item[1]}
        </MenuItem>
      </Link>
  ));

  return (
    <Paper className={fixed ? "app-navbar-container fixed" : "app-navbar-container"} elevation={1} square={true}>
      <Toolbar className="app-navbar">
        <ToolbarGroup className="desktop-hide" firstChild={true}>
          <Button onClick={() => setDrawerOpen(open => !open)}>
            <MenuIcon fontSize="large" />
          </Button>
        </ToolbarGroup>

        <ToolbarGroup className="mobile-hide">
          {navItems}
        </ToolbarGroup>

        <ToolbarGroup lastChild={true}>
          <Link to="/contact"><Button>Contact Us</Button></Link>
        </ToolbarGroup>
      </Toolbar>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        classes={{ paper: "app-navdrawer" }}
      >
        <MenuList>
          {drawerItems}
        </MenuList>
      </Drawer>
    </Paper>
  );
};
