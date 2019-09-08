import * as React from "react";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    bioCard: {
      display: "flex",
      maxHeight: 150,
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    }
  }),
);

interface IBioCardProps {
  name: string;
  image: string;
}

export const BioCard: React.SFC<IBioCardProps> = props => {
  const classes = useStyles();

  return (
    <Card className={classes.bioCard}>
      <div className="app-bio-image-container">
      {props.image ? <CardMedia className="app-bio-image" image={props.image} /> : null}
      </div>
      <CardContent>
        <Typography variant="h4">{props.name}</Typography>
      {props.children}
      </CardContent>
    </Card>
  );
};