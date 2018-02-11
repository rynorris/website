import * as React from "react";
import AppHeader from "./app-header";
import Toaster from "./components/toaster";

export default class Container extends React.PureComponent {
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
};
