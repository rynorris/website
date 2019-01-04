import * as React from "react";
import AppHeader from "./app-header";
import Toaster from "./components/toaster";

export const Container: React.SFC<{}> = (props) =>
  (
    <div className="app-container">
      <AppHeader />
      <div className="app-body">
        {props.children}
      </div>
      <Toaster />
    </div>
  );