import Button from "@material-ui/core/Button";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import SendIcon from "@material-ui/icons/Send";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import {IMessage, MessageService} from "../services/message-service";
import ServiceProvider from "../services/service-provider";
import { IToastAction, Toast } from "../state/actions";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonIcon: {
      marginLeft: theme.spacing(1),
    },
    submitButton: {
      margin: theme.spacing(1),
    },
  }),
);

interface IDispatchProps {
  toast: (text: string) => void;
}

type IContactFormProps = IDispatchProps;

const UnconnectedContactForm: React.SFC<IContactFormProps> = (props) => {
  const classes = useStyles();

  const [sender, setSender] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [body, setBody] = React.useState<string>("");

  const { toast } = props;

  const handleSubmit = async () => {
    const service: MessageService = ServiceProvider.MessageService();
    const message: IMessage = { sender, email, message: body };

    try {
      const response = await service.send(message);
      toast("Message Sent!");
      setSender("");
      setEmail("");
      setBody("");
    } catch (error) {
      toast("Failed to send. Please email or call us directly.");
    }
  };

  return (
    <div className="contact-page-form">
      <TextField
        id="text-field-name"
        label="Name"
        value={sender}
        onChange={(ev) => setSender(ev.currentTarget.value)}
        fullWidth={true}
      />
      <TextField
        id="text-field-email"
        label="Email Address"
        value={email}
        onChange={(ev) => setEmail(ev.currentTarget.value)}
        fullWidth={true}
      />
      <TextField
        id="text-field-message"
        label="Message"
        value={body}
        onChange={(ev) => setBody(ev.currentTarget.value)}
        fullWidth={true}
        multiline={true}
        rows={4}
      />
      <Button className={classes.submitButton} variant="contained" color="primary" onClick={handleSubmit}>
        Send
        <SendIcon className={classes.buttonIcon} />
      </Button>
    </div>
  );
};

const mapDispatchToProps = (dispatch: Dispatch<IToastAction>) => ({
  toast: (text: string) => dispatch(Toast(text)),
});

export const ContactForm = connect(null, mapDispatchToProps)(UnconnectedContactForm);
