import * as React from "react";
import {Card, CardTitle, CardText} from "material-ui/Card";

interface IBioCardProps {
  name: string;
  image: string;
  text: string;
}

export default class BioCard extends React.Component<IBioCardProps, {}> {
  render() {
    return (
      <div className="app-bio">
        <Card>
          <div className="app-bio-image"></div>
          <div className="app-bio-content">
            <CardTitle title={this.props.name} />
            <CardText>
              <div className="app-bio-text">{this.props.text}</div>
            </CardText>
          </div>
        </Card>
      </div>
    );
  }
}


