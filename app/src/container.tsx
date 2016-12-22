import * as React from "react";
import Paper from "material-ui/Paper";
import * as Colors from "material-ui/styles/colors";
import Navbar from "./navbar";

let navbarLinks: string[] = [
  "/one",
  "/two"
];

let navbarTitles: string[] = [
  "One",
  "Two"
];

export var Container = React.createClass({
  render() {
    return (
      <div className="app-container">
        <div className="app-header">
          <Paper zDepth={1} rounded={false}>
            <div className="app-header-image"></div>
            <Navbar links={navbarLinks} titles={navbarTitles} />
          </Paper>
        </div>
        <div className="app-body">
          {this.props.children}
        </div>
      </div>
    );
  }
});
