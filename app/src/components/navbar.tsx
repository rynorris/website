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
        <ToolbarGroup>
          {navItems}
        </ToolbarGroup>

        <ToolbarGroup>
          <div>
            Call us at <a href="tel://07999-888-777">07999-888-777</a> or <a href="tel://07666-555-444">07666-555-444</a>
          </div>
        </ToolbarGroup>
      </Toolbar>
    );
  }
}
