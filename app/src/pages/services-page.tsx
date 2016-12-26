import * as React from "react";
import DynamicPage from "./dynamic-page";

export default class ServicesPage extends React.Component<{}, {}> {
  render() {
    return (
      <div className="services-page">
        <DynamicPage pageId="services" />
      </div>
    );
  }
}
