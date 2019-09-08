import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import * as React from "react";

import ServiceProvider from "../services/service-provider";
import { Login } from "../state/actions";
import {store} from "../state/store";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    errorMessage: {
      marginTop: theme.spacing(1),
    },
  }),
);

interface ILoginWindowProps {
  open: boolean;
  onRequestClose: () => void;
  onSuccess: () => void;
  onFailure: () => void;
}

export const LoginWindow: React.SFC<ILoginWindowProps> = (props) => {
  const classes = useStyles();
  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [loginInProgress, setLoginInProgress] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  const handleLogin = () => {
    const auth = ServiceProvider.AuthService();
    setLoginInProgress(true);
    (async () => {
      try {
        await auth.login({ username, password });
        props.onSuccess();
        store.dispatch(Login({ username }));
        setLoginInProgress(false);
        setErrorMessage("");
        setUsername("");
        setPassword("");
      } catch (error) {
        props.onFailure();
        setErrorMessage(error.message);
        setPassword("");
        setLoginInProgress(false);
      }
    })();
  };

  const cancelLogin = () => {
    setUsername("");
    setPassword("");
    setLoginInProgress(false);
    setErrorMessage("");
    props.onRequestClose();
  };

  const inputFields: JSX.Element = (
    <div className="login-entry hidden">
      <TextField
        id="text-field-username"
        label="Username"
        value={username}
        onChange={(event) => setUsername(event.currentTarget.value)}
        fullWidth={true}
        />
      <TextField
        id="text-field-password"
        label="Password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.currentTarget.value)}
        fullWidth={true}
        />
        <Typography color="error" className={classes.errorMessage}>{errorMessage}</Typography>
    </div>
  );

  return (
    <div>
      <Dialog open={props.open} onClose={props.onRequestClose}>
          <DialogTitle>Login</DialogTitle>
          <DialogContent>
            {loginInProgress ? <div className="login-spinner"><CircularProgress size={100}/></div> : inputFields}
          </DialogContent>
          <DialogActions>
            <Button onClick={cancelLogin}>Cancel</Button>
            <Button disabled={loginInProgress} onClick={handleLogin}>Login</Button>
          </DialogActions>
      </Dialog>
    </div>
  );
};
