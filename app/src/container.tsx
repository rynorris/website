import * as React from "react";
import AppHeader from "./app-header";
import Toaster from "./components/toaster";

export const Container: React.SFC = () =>
  (
    <div className="app-container">
      <AppHeader />
      <div className="app-body">
        {this.props.children}
      </div>
      <Toaster />
    </div>
  );