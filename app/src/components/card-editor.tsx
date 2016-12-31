import * as React from "react";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import TextField from "material-ui/TextField";
import {Card} from "../services/pages-service";
import DynamicCard from "./dynamic-card";
import ImageSelector from "./image-selector";

interface ICardEditorProps {
  onSave: (card: Card) => void;
  card: Card;
  open: boolean;
  onRequestClose: () => void;
}

interface ICardEditorState {
  card?: Card;
  imageSelectorOpen: boolean;
}

export default class CardEditor extends React.Component<ICardEditorProps, ICardEditorState> {
  constructor(props: ICardEditorProps) {
    super(props);
    this.state = {
      imageSelectorOpen: false,
    };

    if (props.card) {
      let clonedCard: Card = JSON.parse(JSON.stringify(props.card));
      this.state.card = clonedCard;
    }
  }

  componentWillReceiveProps(props: ICardEditorProps) {
    if (props.card) {
      let clonedCard: Card = JSON.parse(JSON.stringify(props.card));
      this.setState(Object.assign({}, this.state, { card: clonedCard }));
    }
  }

  render() {
    if (!this.state.card) {
      return <div></div>;
    }

    let actions: any[] = [
      <FlatButton
        label="Cancel"
        onTouchTap={this.props.onRequestClose} />,
      <FlatButton
        label="Ok"
        onTouchTap={(() => this.state.card ? this.props.onSave(this.state.card) : null).bind(this)} />
    ];

    return (
      <Dialog
        title="Edit"
        actions={actions}
        open={this.props.open}
        onRequestClose={this.props.onRequestClose}
        autoScrollBodyContent={true}
        contentClassName="card-editor-dialog"
        modal={true}
        >
        <div className="card-editor">
          <TextField
            id="text-field-title"
            floatingLabelText="Title"
            value={this.state.card.title}
            onChange={this.setTitle.bind(this)}
            fullWidth={true} />
          <br/>
          <TextField
            id="text-field-text"
            floatingLabelText="Text"
            value={this.state.card.text}
            onChange={this.setText.bind(this)}
            fullWidth={true}
            multiLine={true}
            rows={4} />
        </div>
        <FlatButton label="Choose Image" onTouchTap={this.openImageSelector.bind(this)} />
        <FlatButton label="Remove Image" onTouchTap={(() => { this.setImage(""); }).bind(this)} />
        <h3>Preview</h3>
        <DynamicCard card={this.state.card} />
        <ImageSelector
          open={this.state.imageSelectorOpen}
          onRequestClose={this.closeImageSelector.bind(this)}
          onDone={this.setImage.bind(this)}
          />
      </Dialog>
    );
  }

  private setTitle(ev: any) {
    let card: Card | undefined = this.state.card;
    if (card) {
      card.title = ev.currentTarget.value;
      this.setState(Object.assign({}, this.state, { card: card }));
    }
  }

  private setText(ev: any) {
    let card: Card | undefined = this.state.card;
    if (card) {
      card.text = ev.currentTarget.value;
      this.setState(Object.assign({}, this.state, { card: card }));
    }
  }

  private setImage(image: string) {
    let card: Card | undefined = this.state.card;
    if (card) {
      card.image = image;
      this.setState(Object.assign({}, this.state, { card: card }));
    }
    this.closeImageSelector();
  }

  private closeImageSelector() {
    this.setState(Object.assign({}, this.state, { imageSelectorOpen: false }));
  }

  private openImageSelector() {
    this.setState(Object.assign({}, this.state, { imageSelectorOpen: true }));
  }
}
