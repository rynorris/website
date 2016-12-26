import * as React from "react";
import DynamicPage from "./dynamic-page";
import Post from "../components/post";

const aboutText: string = (
`We're really cool.
`
);

export default class AboutPage extends React.Component<{}, {}> {
  render() {
    return (
      <div className="about-page">
        <DynamicPage pageId="about" />
      </div>
    );
  }
}
