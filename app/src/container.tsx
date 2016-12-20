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
        <Paper zDepth={1}>
          <div style={{height: 100, background: Colors.red500}}></div>
          <Navbar links={navbarLinks} titles={navbarTitles} />
        </Paper>
      </div>
    );
  }
});
