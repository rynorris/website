import * as React from "react";
import Post from "../components/post";

const servicesText = (
  <div>
    <p>Our services include:</p>
    <ul>
      <li>Assessments</li>
      <li>Individual Tuition</li>
      <li>Advice</li>
      <li>School Liaison</li>
    </ul>
  </div>
);

export default class ServicesPage extends React.Component<{}, {}> {
  render() {
    return (
      <div className="services-page">
        <Post title="Our Services">{servicesText}</Post>
      </div>
    );
  }
}
