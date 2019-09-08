import * as React from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles, Theme, createStyles, useTheme } from "@material-ui/core/styles";

import ServiceProvider from "../services/service-provider";
import useMediaQuery from "@material-ui/core/useMediaQuery";

interface StyleProps {
  fullScreen: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    imageSelectorContent: {
      display: "flex",
      flexDirection: ({ fullScreen }: StyleProps) => fullScreen ? "column" : "row",
      padding: theme.spacing(2),
    },
    imageList: {
      width: ({ fullScreen }: StyleProps) => fullScreen ? "100%" : "auto",
    },
    imagePreview: {
      minWidth: 100,
      minHeight: 100,
      margin: theme.spacing(2),
    }
  }),
);

interface IImageSelectorProps {
  open: boolean;
  onRequestClose: () => void;
  onDone: (imageUrl: string) => void;
}

interface IImageSelectorState {
  imageKeys: string[];
  selectedValue: string;
}

export const ImageSelector: React.SFC<IImageSelectorProps> = props => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const classes = useStyles({ fullScreen });

  const [imageKeys, setImageKeys] = React.useState<string[]>([]);
  const [selectedValue, setSelectedValue] = React.useState<string>("");

  React.useEffect(() => {
    let image = ServiceProvider.ImageService();

    (async () => {
      try {
        const images = await image.listImages();
        setImageKeys(images);
      } catch (error) {
        console.log("Failed to load image list", error);
      }
    })();
  });

  const handleChoose = () => {
    let image = ServiceProvider.ImageService();
    props.onDone(image.getUrl(selectedValue));
    props.onRequestClose();
  };

  let items = imageKeys.map((key) => {
    return (
      <ListItem
        button
        key={key}
        onClick={() => setSelectedValue(key)}
        selected={selectedValue === key}
        >
        <ListItemText>{key}</ListItemText>
      </ListItem>
    );
  });

  return (
    <div>
      <Dialog fullScreen={fullScreen} open={props.open} onClose={props.onRequestClose}>
        <DialogTitle>Choose Image</DialogTitle>
        <DialogContent className={classes.imageSelectorContent}>
            <List className={classes.imageList}>{items}</List>
            <div className={classes.imagePreview}>
              {selectedValue !== "" ? <img src={"/api/images/" + selectedValue} /> : null}
            </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onRequestClose.bind(this)}>Cancel</Button>
          <Button onClick={handleChoose}>Choose</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
