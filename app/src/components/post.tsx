import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as React from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    imagePostHeader: {
      height: 300,
      position: "relative",
    },
    imagePostTitle: {
      background: "#000000",
      bottom: 0,
      color: "#FFFFFF",
      opacity: 0.5,
      position: "absolute",
      width: "100%",
    },
    postCard: {
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(2),
    },
    postHeader: {},
    postTitle: {},
  }),
);

interface IPostProps {
  title: string;
  image: string;
}

export const Post: React.SFC<IPostProps> = (props) => {
  const classes = useStyles();

  const image = (
    <div className="post-header-image-container">
      <img className="post-header-image" src={props.image} />
    </div>
  );

  const headerClass = props.image !== "" ? classes.imagePostHeader : classes.postHeader;
  const titleClass = props.image !== "" ? classes.imagePostTitle : classes.postTitle;

  return (
    <Card className={classes.postCard}>
      <div className={headerClass}>
        {props.image !== "" && image}
        <CardHeader title={props.title} className={titleClass} />
      </div>
      <CardContent><Typography>{props.children}</Typography></CardContent>
    </Card>
  );
};
