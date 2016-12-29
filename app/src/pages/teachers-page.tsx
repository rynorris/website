import * as React from "react";
import DynamicPage from "./dynamic-page";

export default class TeachersPage extends React.Component<{}, {}> {
  render() {
    return (
      <div className="teachers-page">
        <DynamicPage pageId="teachers" />
      </div>
    );
  }
}
