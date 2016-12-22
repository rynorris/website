import * as React from "react";
import {Card, CardTitle, CardText} from "material-ui/Card";

interface IPostProps {
  title: string;
  text: string;
}

export default class Post extends React.Component<IPostProps, {}> {
  render() {
    return (
      <div className="app-post">
        <Card>
          <CardTitle title={this.props.title} />
          <CardText>{this.props.text}</CardText>
        </Card>
      </div>
    );
  }
}

