import * as React from "react";
import Post from "../components/post";

const welcomeText: string = (
`Are you concerned that your child may have dyslexia or is struggling at school?
 
We are a team of highly qualified specialist teachers with many years experience in assessing and teaching children with specific learning difficulties.
 
If you need help and advice, please contact us at the Dyslexia Tuition Centre.
 
We're here to help your child enjoy their education and to give them the confidence to become independent learners.`
);

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

export default class FrontPage extends React.Component<{}, {}> {
  render() {
    return (
      <div className="front-page">
        <Post title="Welcome">{welcomeText}</Post>
        <Post title="Our Services">{servicesText}</Post>
      </div>
    );
  }
}
