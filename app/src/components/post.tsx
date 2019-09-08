import * as React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    imagePostHeader: {
      position: "relative",
      height: 300,
    },
    imagePostTitle: {
      position: "absolute",
      bottom: 0,
      width: "100%",
      color: "#FFFFFF",
      background: "#000000",
      opacity: 0.5,
    },
    postHeader: {},
    postTitle: {},
  }),
);

interface IPostProps {
  title: string;
  image: string;
}

export const Post: React.SFC<IPostProps> = props => {
  const classes = useStyles();

  const image = (
    <div className="post-header-image-container">
      <img className="post-header-image" src={props.image} />
    </div>
  );

  const headerClass = props.image !== "" ? classes.imagePostHeader : classes.postHeader;
  const titleClass = props.image !== "" ? classes.imagePostTitle : classes.postTitle;

  return (
    <div className="app-post">
      <Card>
        <div className={headerClass}>
          {props.image !== "" && image}
          <CardHeader title={props.title} className={titleClass} />
        </div>
        <CardContent><Typography>{props.children}</Typography></CardContent>
      </Card>
    </div>
  );
};
