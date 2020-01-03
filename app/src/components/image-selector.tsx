import * as React from "react";
import { connect } from "react-redux";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import ServiceProvider from "../services/service-provider";
import { AppDispatch, IAppState } from "../state/model";
import { fetchImageList } from "../state/thunk";
import { ImageUploader } from "./image-uploader";

interface IStyleProps {
  fullScreen: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    imageList: {
      width: "100%",
    },
    imageListContainer: {
      flexGrow: ({ fullScreen }: IStyleProps) => fullScreen ? 1 : 0,
      minWidth: ({ fullScreen }: IStyleProps) => fullScreen ? "100%" : 250,
      overflowX: "hidden",
      overflowY: "scroll",
      width: ({ fullScreen }: IStyleProps) => fullScreen ? "100%" : 250,
    },
    imagePreview: {
      "& img": {
        width: "100%",
      },
      flexGrow: ({ fullScreen }: IStyleProps) => fullScreen ? 0 : 1,
      margin: theme.spacing(2),
      minHeight: 100,
    },
    imageSelectorContent: {
      alignItems: "stretch",
      display: "flex",
      flexDirection: ({ fullScreen }: IStyleProps) => fullScreen ? "column" : "row",
      height: ({ fullScreen }: IStyleProps) => fullScreen ? "100%" : 500,
      overflow: "hidden",
      padding: theme.spacing(2),
    },
    imageSelectorDialog: {
      width: "100%",
    },
  }),
);

interface IImageSelectorProps {
  open: boolean;
  imageKeys: string[];
  loadKeys: () => void;
  onRequestClose: () => void;
  onSetAsHeader: (imageUrl: string) => void;
  onInsertImage: (name: string, url: string) => void;
}

const UnconnectedImageSelector: React.SFC<IImageSelectorProps> = (props) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const classes = useStyles({ fullScreen });

  const [uploaderOpen, setUploaderOpen] = React.useState<boolean>(false);
  const [selectedValue, setSelectedValue] = React.useState<string>("");

  React.useEffect(() => {
    props.loadKeys();
  }, []);

  const handleSetAsHeader = () => {
    const image = ServiceProvider.ImageService();
    props.onSetAsHeader(image.getUrl(selectedValue));
  };

  const handleInsertImage = () => {
    const image = ServiceProvider.ImageService();
    props.onInsertImage(selectedValue, image.getUrl(selectedValue));
  };

  const openUploader = () => setUploaderOpen(true);
  const closeUploader = () => setUploaderOpen(false);
  const uploadDone = (key: string) => {
    props.loadKeys();
    setSelectedValue(key);
  };

  const items = props.imageKeys.map((key) => {
    return (
      <ListItem
        button={true}
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
      <Dialog
        PaperProps={{ className: classes.imageSelectorDialog }}
        fullScreen={fullScreen}
        open={props.open}
        onClose={props.onRequestClose}
      >
        <DialogTitle>Choose Image</DialogTitle>
        <DialogContent className={classes.imageSelectorContent}>
          <div className={classes.imageListContainer}>
            <List className={classes.imageList}>{items}</List>
          </div>
          <div className={classes.imagePreview}>
            {selectedValue !== "" ? <img src={"/api/images/" + selectedValue} /> : null}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onRequestClose}>Cancel</Button>
          <Button onClick={openUploader}>Upload</Button>
          <Button onClick={handleSetAsHeader}>Set as Header</Button>
          <Button onClick={handleInsertImage}>Insert</Button>
        </DialogActions>
      </Dialog>
      <ImageUploader open={uploaderOpen} onRequestClose={closeUploader} onDone={uploadDone} />
    </div>
  );
};

const mapStateToProps = (state: IAppState) => ({
  imageKeys: state.image.list,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  loadKeys: () => dispatch(fetchImageList()),
});

export const ImageSelector = connect(mapStateToProps, mapDispatchToProps)(UnconnectedImageSelector);
