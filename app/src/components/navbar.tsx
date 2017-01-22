import * as React from "react";
import * as ReactDOM from "react-dom";
import * as throttle from "lodash/throttle";
import * as map from "lodash/map";
import * as zip from "lodash/zip";
import {Link} from "react-router";
import Drawer from "material-ui/Drawer";
import FlatButton from "material-ui/FlatButton";
import IconButton from "material-ui/IconButton";
import MenuItem from "material-ui/MenuItem";
import NavigationMenu from "material-ui/svg-icons/navigation/menu";
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from "material-ui/Toolbar";

const SCROLL_LISTEN_INTERVAL: number = 50;

interface INavbarProps {
  links: string[];
  titles: string[];
}

interface INavbarState {
  drawerOpen?: boolean;
  navbarFixed?: boolean;
}

export default class Navbar extends React.Component<INavbarProps, INavbarState> {
  private navbar: any;

  constructor(props: INavbarProps) {
    super(props);
    this.state = { drawerOpen: false, navbarFixed: false };
    this.handleScroll = throttle(this.handleScroll.bind(this), SCROLL_LISTEN_INTERVAL);
  }

  componentWillMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  render() {
    let navItems = map(zip(this.props.links, this.props.titles),
                         function(item: string[], ix: number) {
      return (
        <Link key={"nav-item-" + ix} to={item[0]}>
          <FlatButton label={item[1]} />
        </Link>
      );
    });

    let drawerItems = map(zip(this.props.links, this.props.titles),
                         function(item: string[], ix: number) {
      return (
        <Link key={"drawer-item-" + ix} to={item[0]}>
          <MenuItem onTouchTap={this.closeDrawer.bind(this)}>
            {item[1]}
          </MenuItem>
        </Link>
      );
    }.bind(this));

    return (
      <div>
        <Toolbar className={this.state.navbarFixed ? "app-navbar fixed" : "app-navbar"}>
          <ToolbarGroup className="desktop-hide" firstChild={true}>
            <IconButton onTouchTap={this.toggleDrawer.bind(this)}>
             <NavigationMenu />
            </IconButton>
          </ToolbarGroup>

          <ToolbarGroup className="mobile-hide">
            {navItems}
          </ToolbarGroup>

          <ToolbarGroup lastChild={true}>
            <Link to="/contact"><FlatButton label="Contact Us" /></Link>
          </ToolbarGroup>
        </Toolbar>

        <Drawer
          containerClassName="app-navdrawer"
          open={this.state.drawerOpen}
          docked={false}
          onRequestChange={this.setDrawer.bind(this)}>
          {drawerItems}
        </Drawer>
      </div>
    );
  }

  private toggleDrawer() {
    this.setDrawer(!this.state.drawerOpen);
  }

  private closeDrawer() {
    this.setDrawer(false);
  }

  private setDrawer(open: boolean) {
    this.setState({ drawerOpen: open });
  }

  private handleScroll() {
    const thisTop = ReactDOM.findDOMNode(this).getClientRects()[0].top;
    const navbarFixed = thisTop <= 0 ? true : false;
    this.setState({ navbarFixed });
  }
}
