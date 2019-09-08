import * as React from "react";
import { ConnectedAppHeader } from "./app-header";
import { Toaster } from "./components/toaster";

export const Container: React.SFC<{}> = (props) =>
  (
    <div className="app-container">
      <ConnectedAppHeader />
      <div className="app-body">
        {props.children}
      </div>
      <Toaster duration={2000} />
    </div>
  );