import Paper from "@material-ui/core/Paper";
import * as React from "react";

interface IFloatingLogoProps {
  src: string;
}

export const FloatingLogo: React.SFC<IFloatingLogoProps> = ({ src }) => (
  <Paper className="floating-logo">
    <img className="floating-logo-img" src={src}/>
  </Paper>
);
