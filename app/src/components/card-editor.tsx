import * as React from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useTheme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import {Card} from "../services/pages-service";
import { DynamicCard } from "./dynamic-card";
import { ImageSelector } from "./image-selector";

interface ICardEditorProps {
  onSave: (card: Card) => void;
  card: Card;
  open: boolean;
  onRequestClose: () => void;
}

export const CardEditor: React.SFC<ICardEditorProps> = (props) => {
  const clonedCard: Card = JSON.parse(JSON.stringify(props.card));

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [card, setCard] = React.useState<Card>(clonedCard);
  const [imageSelectorOpen, setImageSelectorOpen] = React.useState<boolean>(false);

  const doSave = () => props.onSave(card);

  const setTitle = (ev: any) => setCard((prevCard: Card) => ({ ...prevCard, title: ev.currentTarget.value }));

  const setText = (ev: any) => setCard((prevCard: Card) => ({ ...prevCard, text: ev.currentTarget.value }));

  const setImage = (image: string) => {
    setCard((prevCard: Card) => ({ ...prevCard, image }));
    setImageSelectorOpen(false);
  };

  const removeImage = () => setImage("");

  const closeImageSelector = () => setImageSelectorOpen(false);

  const openImageSelector = () => setImageSelectorOpen(true);

  return (
    <Dialog
      open={props.open}
      onClose={props.onRequestClose}
      fullScreen={fullScreen}
      aria-labelledby="card-editor-dialog-title"
    >
      <DialogTitle id="card-editor-dialog-title">Edit</DialogTitle>
      <DialogContent>
        <TextField
          id="text-field-title"
          label="Title"
          value={card.title}
          onChange={setTitle}
          fullWidth={true}
        />
        <br/>
        <TextField
          id="text-field-text"
          label="Text"
          value={card.text}
          onChange={setText}
          fullWidth={true}
          multiline={true}
          rows={4}
        />
      <Button onClick={openImageSelector}>Choose Image</Button>
      <Button onClick={removeImage}>Remove Image</Button>
      <Typography variant="h4">Preview</Typography>
      <DynamicCard card={card} />
      <ImageSelector
        open={imageSelectorOpen}
        onRequestClose={closeImageSelector}
        onDone={setImage}
      />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onRequestClose}>Cancel</Button>
        <Button onClick={doSave}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
};
