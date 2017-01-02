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
          <div className="app-bio-image">
            <img src="/api/images/placeholder-150x150.png" alt={this.props.name} />
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


