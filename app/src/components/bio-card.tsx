import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as React from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    bioCard: {
      display: "flex",
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
  }),
);

interface IBioCardProps {
  name: string;
  image: string;
}

export const BioCard: React.SFC<IBioCardProps> = (props) => {
  const classes = useStyles();

  return (
    <Card className={classes.bioCard}>
      <div className="app-bio-image-container">
      {props.image ? <img className="app-bio-image" src={props.image} /> : null}
      </div>
      <CardContent>
        <Typography variant="h4">{props.name}</Typography>
      {props.children}
      </CardContent>
    </Card>
  );
};
