import * as React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import SendIcon from "@material-ui/icons/Send";
import {Message, MessageService} from "../services/message-service";
import ServiceProvider from "../services/service-provider";
import Toaster from "./toaster";
import { makeStyles } from "@material-ui/core/styles";
import { Theme, createStyles } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonIcon: {
      marginLeft: theme.spacing(1),
    }
  }),
);

export const ContactForm: React.SFC<{}> = () => {
  const classes = useStyles();

  const [sender, setSender] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [body, setBody] = React.useState<string>("");

  const handleSubmit = async () => {
    let service: MessageService = ServiceProvider.MessageService();
    let message: Message = { sender, email, message: body };

    try {
      let response = await service.send(message);
      Toaster.toast("Message Sent!");
      setSender("");
      setEmail("");
      setBody("");
    } catch (error) {
      Toaster.toast("Failed to send. Please email or call us directly.");
    }
  };

  return (
    <div className="contact-page-form">
      <TextField
        id="text-field-name"
        label="Name"
        value={sender}
        onChange={ev => setSender(ev.currentTarget.value)}
        fullWidth={true} />
      <br/>
      <TextField
        id="text-field-email"
        label="Email Address"
        value={email}
        onChange={ev => setEmail(ev.currentTarget.value)}
        fullWidth={true} />
      <br/>
      <TextField
        id="text-field-message"
        label="Message"
        value={body}
        onChange={ev => setBody(ev.currentTarget.value)}
        fullWidth={true}
        multiline={true}
        rows={4} />
      <br/>
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Send
        <SendIcon className={classes.buttonIcon} />
      </Button>
    </div>
  );
};
