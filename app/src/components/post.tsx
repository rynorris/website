import * as React from "react";
import {Card, CardMedia, CardTitle, CardText} from "material-ui/Card";

interface IPostProps {
  title: string;
  image: string;
}

export default class Post extends React.Component<IPostProps, {}> {
  render() {
    let header: JSX.Element;
    if (this.props.image) {
      header = (
        <CardMedia overlay={<CardTitle title={this.props.title} />} >
          <div className="post-header-image-container">
            <img className="post-header-image" src={this.props.image}/>
          </div>
        </CardMedia>
      );
    } else {
          header = <CardTitle title={this.props.title} />;
    }
    return (
      <div className="app-post">
        <Card>
          {header}
          <CardText>{this.props.children}</CardText>
        </Card>
      </div>
    );
  }
}

