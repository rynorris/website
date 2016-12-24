import * as React from "react";
import Post from "../components/post";

const aboutText: string = (
`We're really cool.
`
);

export default class AboutPage extends React.Component<{}, {}> {
  render() {
    return (
      <div className="about-page">
        <Post title="About">{aboutText}</Post>
      </div>
    );
  }
}
