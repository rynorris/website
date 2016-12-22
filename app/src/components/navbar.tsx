import * as React from "react";
import * as _ from "lodash";
import {Link} from "react-router";
import FlatButton from 'material-ui/FlatButton';
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
      <Toolbar className="app-navbar">
        <ToolbarGroup className="mobile-hide">
          {navItems}
        </ToolbarGroup>

        <ToolbarGroup>
          <Link to="/contact"><FlatButton label="Contact Us" /></Link>
        </ToolbarGroup>
      </Toolbar>
    );
  }
}
