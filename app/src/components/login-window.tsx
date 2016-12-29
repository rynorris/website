import * as React from "react";
import CircularProgress from "material-ui/CircularProgress";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import TextField from "material-ui/TextField";

import ServiceProvider from "../services/service-provider";
import {Login, store} from "../redux/state";

interface ILoginWindowProps {
  open: boolean;
  onRequestClose: () => void;
  onSuccess: () => void;
  onFailure: () => void;
}

interface ILoginWindowState {
  username: string;
  password: string;
  loginInProgress: boolean;
  errorMessage: string;
}

export default class LoginWindow extends React.Component<ILoginWindowProps, ILoginWindowState> {
  constructor(props: ILoginWindowProps) {
    super(props);
    this.state = {
      username: "",
      password: "",
      loginInProgress: false,
      errorMessage: "",
    };
  }

  render() {
    let loginButton: JSX.Element;

    let actions: any[] = [
      <FlatButton
        label="Cancel"
        onTouchTap={this.props.onRequestClose} />,
      <FlatButton
        label="Login"
        disabled={this.state.loginInProgress}
        onTouchTap={this.handleLogin.bind(this)} />
    ];

    let inputFields: JSX.Element = (
      <div className="login-entry hidden">
        <TextField
          id="text-field-username"
          floatingLabelText="Username"
          value={this.state.username}
          onChange={this.setUsername.bind(this)}
          fullWidth={true}
          />
        <br/>
        <TextField
          id="text-field-password"
          floatingLabelText="Password"
          type="password"
          value={this.state.password}
          onChange={this.setPassword.bind(this)}
          fullWidth={true}
          />
        <div className="login-error-message">{this.state.errorMessage}</div>
      </div>
    );

    return (
      <div>
        <Dialog
          title="Login"
          open={this.props.open}
          actions={actions}
          onRequestClose={this.props.onRequestClose}
          autoScrollBodyContent={true}
          contentClassName="login-window"
          bodyClassName="login-window-body"
          >
          {this.state.loginInProgress ? <div className="login-spinner"><CircularProgress size={100}/></div> : inputFields}
        </Dialog>
      </div>
    );
  }

  private handleLogin() {
    let auth = ServiceProvider.AuthService();
    this.setState(Object.assign({}, this.state, { loginInProgress: true }));
    auth.login({
      username: this.state.username,
      password: this.state.password
    }).then(() => {
      this.props.onSuccess();
      this.setState(Object.assign({}, this.state, { loginInProgress: false, errorMessage: "" }));
      store.dispatch(Login());
    }).catch((e) => {
      this.props.onFailure();
      this.setState(Object.assign({}, this.state, {
        loginInProgress: false,
        errorMessage: e.message,
        password: "",
      }));
    });
  }

  private cancelLogin() {
    this.setState(Object.assign({}, this.state, { dialogOpen: false }));
  }

  private setUsername(ev: any) {
    this.setState(Object.assign({}, this.state, { username: ev.currentTarget.value }));
  }

  private setPassword(ev: any) {
    this.setState(Object.assign({}, this.state, { password: ev.currentTarget.value }));
  }
}
