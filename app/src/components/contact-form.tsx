import * as React from "react";
import ContentSend from "material-ui/svg-icons/content/send";
import RaisedButton from 'material-ui/RaisedButton';
import TextField from "material-ui/TextField";
import Toaster from "./toaster";

interface IContactFormState {
  name?: string;
  email?: string;
  message?: string;
}

export default class ContactForm extends React.Component<{}, IContactFormState> {
  private toaster: Toaster;

  constructor(props: {}) {
    super(props);
    this.state = {
      name: "",
      email: "",
      message: "",
    };
  }

  private handleSubmit() {
    this.toaster.toast("Message Sent!");
    this.setState({
      name: "",
      email: "",
      message: "",
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
        <Toaster ref={(t) => { this.toaster = t; }} />
      </div>
    );
  }

  private setName(ev: any) {
    this.setState({name: ev.currentTarget.value});
  }


  private setEmail(ev: any) {
    this.setState({email: ev.currentTarget.value});
  }


  private setMessage(ev: any) {
    this.setState({message: ev.currentTarget.value});
  }
}
