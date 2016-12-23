import * as React from "react";
import * as _ from "lodash";
import {Link} from "react-router";
import FlatButton from 'material-ui/FlatButton';
import IconButton from "material-ui/IconButton";
import NavigationMenu from "material-ui/svg-icons/navigation/menu";
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

interface INavbarProps {
  links: string[];
  titles: string[];
}

export default class Navbar extends React.Component<INavbarProps, {}> {
  render() {
    let navItems = _.map(_.zip(this.props.links, this.props.titles), 
                         function(item: string[], ix: number) {
      return <Link key={"nav-item-" + ix} to={item[0]}><FlatButton label={item[1]} /></Link>;
    });

    return (
      <div>
        <Toolbar className="app-navbar">
          <ToolbarGroup className="desktop-hide" firstChild={true}>
            <IconButton>
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
      </div>
    );
  }
}
