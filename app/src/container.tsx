import * as React from "react";
import AppHeader from "./app-header";
import Toaster from "./components/toaster";

export let Container = React.createClass({
  render() {
    return (
      <div className="app-container">
        <AppHeader />
        <div className="app-body">
          {this.props.children}
        </div>
        <Toaster />
      </div>
    );
  }
});
