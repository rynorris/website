import * as React from "react";
import {Unsubscribe} from "redux";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";

import LoginWindow from "./login-window";
import Toaster from "./toaster";
import {UserInfo} from "../services/auth-service";
import ServiceProvider from "../services/service-provider";
import {Login, Logout, store} from "../redux/state";

interface ILoginWidgetState {
  user: UserInfo | null;
  dialogOpen: boolean;
}

export default class LoginWidget extends React.Component<{}, ILoginWidgetState> {
  private unsubscribe: Unsubscribe;

  constructor(props: {}) {
    super(props);
    this.state = {
      user: null,
      dialogOpen: false,
    };
  }

  componentDidMount() {
      this.unsubscribe = store.subscribe(() => {
      const user = store.getState().auth.user;
      if (user !== this.state.user) {
        this.setState(Object.assign({}, this.state, { user: user }));
      }
    });

    let auth = ServiceProvider.AuthService();
    auth.whoAmI().then((userInfo: any) => {
      // If not logged in,  we get empty.
      if (userInfo === null) {
        return Promise.reject("Not Logged In");
      }
      return Promise.resolve(userInfo);
    }).then((userInfo) => {
      store.dispatch(Login(userInfo));
    }).catch(() => {
      store.dispatch(Logout());
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    let loginButton: JSX.Element;
    if (this.state.user) {
      loginButton = <FlatButton label="Logout" onTouchTap={this.doLogout.bind(this)} />;
    } else {
      loginButton = <FlatButton label="Login" onTouchTap={this.openDialog.bind(this)} />;
    }

    return (
      <div className="login-widget">
        {this.state.user ? <span>Logged in as {this.state.user.username}</span> : null}
        {loginButton}
        <LoginWindow
          open={this.state.dialogOpen}
          onRequestClose={this.closeDialog.bind(this)}
          onSuccess={this.onLoginSuccess.bind(this)}
          onFailure={this.onLoginFailure.bind(this)}
          />
      </div>
    );
  }

  private doLogout() {
    let auth = ServiceProvider.AuthService();
    auth.logout().then(() => {
      store.dispatch(Logout());
      Toaster.toast("Logged out");
    }).catch(() => {
      Toaster.toast("Failed to log out");
    });
  }

  private onLoginSuccess() {
    Toaster.toast("Login Successful");
    this.closeDialog();
  }

  private onLoginFailure() {
    Toaster.toast("Login Failed");
  }

  private closeDialog() {
    this.setState(Object.assign({}, this.state, { dialogOpen: false }));
  }

  private openDialog() {
    this.setState(Object.assign({}, this.state, { dialogOpen: true }));
  }
}
