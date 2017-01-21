import * as React from "react";
import Paper from "material-ui/Paper";

interface FloatingLogoProps {
  src: string;
}

export default class FloatingLogo extends React.Component<FloatingLogoProps, {}> {
  render() {
    return (
      <Paper className="floating-logo">
        <img className="floating-logo-img" src={this.props.src}/>
      </Paper>
    );
  }
}
