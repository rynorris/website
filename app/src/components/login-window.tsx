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
}

interface ILoginWindowState {
  username: string;
  password: string;
  loginInProgress: boolean;
}

export default class LoginWindow extends React.Component<ILoginWindowProps, ILoginWindowState> {
  constructor(props: ILoginWindowProps) {
    super(props);
    this.state = {
      username: "",
      password: "",
      loginInProgress: false,
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
      </div>
    );

    return (
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
    );
  }

  private handleLogin() {
    let auth = ServiceProvider.AuthService();
    this.setState(Object.assign({}, this.state, { loginInProgress: true }));
    auth.login({
      username: this.state.username,
      password: this.state.password
    }).then(() => {
      store.dispatch(Login());
      this.setState(Object.assign({}, this.state, { loginInProgress: false }));
    }).catch((e) => {
      console.log(e);
      this.setState(Object.assign({}, this.state, { loginInProgress: false }));
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
