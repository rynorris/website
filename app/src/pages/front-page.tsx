import * as React from "react";
import DynamicPage from "./dynamic-page";

export default class FrontPage extends React.Component<{}, {}> {
  render() {
    return (
      <div className="front-page">
        <DynamicPage pageId="home" />
      </div>
    );
  }
}
