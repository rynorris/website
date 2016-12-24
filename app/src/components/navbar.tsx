import * as React from "react";
import * as _ from "lodash";
import {Link} from "react-router";
import Drawer from "material-ui/Drawer";
import FlatButton from 'material-ui/FlatButton';
import IconButton from "material-ui/IconButton";
import MenuItem from "material-ui/MenuItem";
import NavigationMenu from "material-ui/svg-icons/navigation/menu";
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

interface INavbarProps {
  links: string[];
  titles: string[];
}

interface INavbarState {
  drawerOpen: boolean;
}

export default class Navbar extends React.Component<INavbarProps, INavbarState> {
  constructor(props: INavbarProps) {
    super(props);
    this.state = { drawerOpen: false };
  }

  render() {
    let navItems = _.map(_.zip(this.props.links, this.props.titles), 
                         function(item: string[], ix: number) {
      return <Link key={"nav-item-" + ix} to={item[0]}><FlatButton label={item[1]} /></Link>;
    });

    let drawerItems = _.map(_.zip(this.props.links, this.props.titles), 
                         function(item: string[], ix: number) {
      return <MenuItem onTouchTap={this.closeDrawer.bind(this)}>{item[1]}</MenuItem>;
    }.bind(this));

    return (
      <div>
        <Toolbar className="app-navbar">
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
}
