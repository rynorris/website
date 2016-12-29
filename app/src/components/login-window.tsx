import * as React from "react";
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
}

export default class LoginWindow extends React.Component<ILoginWindowProps, ILoginWindowState> {
  constructor(props: ILoginWindowProps) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
  }

  render() {
    let actions: any[] = [
      <FlatButton
        label="Cancel"
        onTouchTap={this.props.onRequestClose} />,
      <FlatButton
        label="Login"
        onTouchTap={this.handleLogin.bind(this)} />
    ];

    return (
      <Dialog
        title="Login"
        open={this.props.open}
        actions={actions}
        onRequestClose={this.props.onRequestClose}
        autoScrollBodyContent={true}
        >
        <div className="login-entry">
          <TextField
            id="text-field-username"
            floatingLabelText="Username"
            value={this.state.username}
            onChange={this.setUsername.bind(this)}
            fullWidth={true} />
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
      </Dialog>
    );
  }

  private handleLogin() {
    let auth = ServiceProvider.AuthService();
    auth.login({
      username: this.state.username,
      password: this.state.password
    }).then(() => {
      store.dispatch(Login());
    }).catch(() => {
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
