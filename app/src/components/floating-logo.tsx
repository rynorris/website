import * as React from "react";
import Paper from "@material-ui/core/Paper";

interface FloatingLogoProps {
  src: string;
}

export const FloatingLogo: React.SFC<FloatingLogoProps> = ({ src }) => (
  <Paper className="floating-logo">
    <img className="floating-logo-img" src={src}/>
  </Paper>
);
