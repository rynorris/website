import * as React from "react";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import TextField from "material-ui/TextField";
import {Card} from "../services/pages-service";

interface ICardEditorProps {
  onSave: (card: Card) => void;
  card: Card;
  open: boolean;
  onRequestClose: () => void;
}

interface ICardEditorState {
  card?: Card;
}

export default class CardEditor extends React.Component<ICardEditorProps, ICardEditorState> {
  constructor(props: ICardEditorProps) {
    super(props);
    if (props.card) {
      let clonedCard: Card = JSON.parse(JSON.stringify(props.card));
      this.state = {card: clonedCard};
    } else {
      this.state = {};
    }
  }

  componentWillReceiveProps(props: ICardEditorProps) {
    if (props.card) {
      let clonedCard: Card = JSON.parse(JSON.stringify(props.card));
      this.state = {card: clonedCard};
    } else {
      this.state = {};
    }
  }

  render() {
    if (!this.state.card) {
      return <div></div>;
    }

    let actions: any[] = [
      <FlatButton 
        label="Save" 
        onTouchTap={(() => this.state.card ? this.props.onSave(this.state.card) : null).bind(this)} />
    ];

    return (
      <Dialog
        title="Edit"
        actions={actions}
        open={this.props.open}
        onRequestClose={this.props.onRequestClose}
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
      </Dialog>
    );
  }

  private setTitle(ev: any) {
    let newState: ICardEditorState = this.state;
    if (newState.card) {
      newState.card.title = ev.currentTarget.value;
      this.setState(newState);
    }
  }

  private setText(ev: any) {
    let newState: ICardEditorState = this.state;
    if (newState.card) {
      newState.card.text = ev.currentTarget.value;
      this.setState(newState);
    }
  }
}
