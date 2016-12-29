import * as React from "react";
import ContentSend from "material-ui/svg-icons/content/send";
import RaisedButton from "material-ui/RaisedButton";
import {Message, MessageService} from "../services/message-service";
import ServiceProvider from "../services/service-provider";
import TextField from "material-ui/TextField";
import Toaster from "./toaster";

interface IContactFormState {
  name: string;
  email: string;
  message: string;
}

export default class ContactForm extends React.Component<{}, IContactFormState> {

  constructor(props: {}) {
    super(props);
    this.state = {
      name: "",
      email: "",
      message: "",
    };
  }

  private handleSubmit() {
    let service: MessageService = ServiceProvider.MessageService();
    let message: Message = {
      sender: this.state.name,
      email: this.state.email,
      message: this.state.message,
    };

    let response: Promise<any> = service.send(message);
    Promise.resolve(response).then(() => {
      Toaster.toast("Message Sent!");
      this.setState({
        name: "",
        email: "",
        message: "",
      });
    }, () => {
      Toaster.toast("Failed to send. Please email or call us directly.");
    });
  }

  render() {
    return (
      <div className="contact-page-form">
        <TextField
          id="text-field-name"
          floatingLabelText="Name"
          value={this.state.name}
          onChange={this.setName.bind(this)}
          fullWidth={true} />
        <br/>
        <TextField
          id="text-field-email"
          floatingLabelText="Email Address"
          value={this.state.email}
          onChange={this.setEmail.bind(this)}
          fullWidth={true} />
        <br/>
        <TextField
          id="text-field-message"
          floatingLabelText="Message"
          value={this.state.message}
          onChange={this.setMessage.bind(this)}
          fullWidth={true}
          multiLine={true}
          rows={4} />
        <br/>
        <RaisedButton
          label="Send"
          labelPosition="before"
          onTouchTap={this.handleSubmit.bind(this)}
          icon={<ContentSend />} />
      </div>
    );
  }

  private setName(ev: any) {
    let newState: IContactFormState = this.state;
    newState.name = ev.currentTarget.value;
    this.setState(newState);
  }


  private setEmail(ev: any) {
    let newState: IContactFormState = this.state;
    newState.email = ev.currentTarget.value;
    this.setState(newState);
  }


  private setMessage(ev: any) {
    let newState: IContactFormState = this.state;
    newState.message = ev.currentTarget.value;
    this.setState(newState);
  }
}
