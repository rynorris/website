import * as React from "react";
import {Card, CardTitle, CardText} from "material-ui/Card";

interface IBioCardProps {
  name: string;
  image: string;
}

export default class BioCard extends React.Component<IBioCardProps, {}> {
  render() {
    return (
      <div className="app-bio">
        <Card>
          <div className="app-bio-image-container">
          {this.props.image ? <img className="app-bio-image" src={this.props.image} alt={this.props.name} /> : null}
          </div>
          <div className="app-bio-content">
            <CardTitle title={this.props.name} />
            <CardText>
            {this.props.children}
            </CardText>
          </div>
        </Card>
      </div>
    );
  }
}


