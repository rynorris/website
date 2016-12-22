import * as React from "react";
import * as _ from "lodash";
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
      return <FlatButton key={"nav-item-" + ix} href={item[0]} label={item[1]} />;
    });

    return (
      <Toolbar className="app-navbar">
        <ToolbarGroup>
          <ToolbarTitle text="Website" />
          <ToolbarSeparator />
        </ToolbarGroup>
        <ToolbarGroup>
          {navItems}
        </ToolbarGroup>
      </Toolbar>
    );
  }
}
