import * as React from "react";
import Post from "./post";

const welcomeText: string = (
`Are you concerned that your child may have dyslexia or is struggling at school?
 
We are a team of highly qualified specialist teachers with many years experience in assessing and teaching children with specific learning difficulties.
 
If you need help and advice, please contact us at the Dyslexia Tuition Centre.
 
We're here to help your child enjoy their education and to give them the confidence to become independent learners.`
);

export default class FrontPage extends React.Component<{}, {}> {
  render() {
    return (
      <Post title="Welcome" text={welcomeText} />
    );
  }
}
