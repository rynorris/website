import * as React from "react";
import {Unsubscribe} from "redux";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";

import LoginWindow from "./login-window";
import Toaster from "./toaster";
import ServiceProvider from "../services/service-provider";
import {Login, Logout, store} from "../redux/state";

interface ILoginWidgetState {
  loggedIn: boolean;
  dialogOpen: boolean;
}

export default class LoginWidget extends React.Component<{}, ILoginWidgetState> {
  private toaster: Toaster;
  private unsubscribe: Unsubscribe;

  constructor(props: {}) {
    super(props);
    this.state = {
      loggedIn: false,
      dialogOpen: false,
    };
  }

  componentDidMount() {
      this.unsubscribe = store.subscribe(() => {
      let loggedIn = store.getState().auth.loggedIn;
      if (loggedIn !== this.state.loggedIn) {
        this.setState(Object.assign({}, this.state, { loggedIn: loggedIn }));
      }
    });

    let auth = ServiceProvider.AuthService();
    auth.whoAmI().then((userInfo) => {
      store.dispatch(Login());
    }).catch(() => {
      store.dispatch(Logout());
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    let loginButton: JSX.Element;
    if (this.state.loggedIn) {
      loginButton = <FlatButton label="Logout" onTouchTap={this.doLogout.bind(this)} />;
    } else {
      loginButton = <FlatButton label="Login" onTouchTap={this.openDialog.bind(this)} />;
    }

    return (
      <div className="login-widget">
        {this.state.loggedIn ? <span>Logged in</span> : null}
        {loginButton}
        <LoginWindow
          open={this.state.dialogOpen}
          onRequestClose={this.closeDialog.bind(this)}
          onSuccess={this.onLoginSuccess.bind(this)}
          onFailure={this.onLoginFailure.bind(this)}
          />
        <Toaster ref={(t) => { this.toaster = t; }} />
      </div>
    );
  }

  private doLogout() {
    let auth = ServiceProvider.AuthService();
    auth.logout().then(() => {
      store.dispatch(Logout());
      this.toaster.toast("Logged out");
    }).catch(() => {
      this.toaster.toast("Failed to log out");
    });
  }

  private onLoginSuccess() {
    this.toaster.toast("Login Successful");
    this.closeDialog();
  }

  private onLoginFailure() {
    this.toaster.toast("Login Failed");
  }

  private closeDialog() {
    this.setState(Object.assign({}, this.state, { dialogOpen: false }));
  }

  private openDialog() {
    this.setState(Object.assign({}, this.state, { dialogOpen: true }));
  }
}
