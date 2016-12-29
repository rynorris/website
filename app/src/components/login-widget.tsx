import * as React from "react";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";

import LoginWindow from "./login-window";
import ServiceProvider from "../services/service-provider";
import {Login, Logout, store} from "../redux/state";

interface ILoginWidgetState {
  loggedIn: boolean;
  dialogOpen: boolean;
}

export default class LoginWidget extends React.Component<{}, ILoginWidgetState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      loggedIn: false,
      dialogOpen: false,
    };
  }

  componentDidMount() {
    store.subscribe(() => {
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

  render() {
    if (this.state.loggedIn) {
      return (
        <div className="login-widget">
          <FlatButton label="Logged in" disabled={true} />
        </div>
      );
    } else {
      return (
        <div className="login-widget">
          <FlatButton label="Login" onTouchTap={this.openDialog.bind(this)} />
          <LoginWindow
            open={this.state.dialogOpen}
            onRequestClose={this.closeDialog.bind(this)}
            />
        </div>
      );
    }
  }

  private closeDialog() {
    this.setState(Object.assign({}, this.state, { dialogOpen: false }));
  }

  private openDialog() {
    this.setState(Object.assign({}, this.state, { dialogOpen: true }));
  }
}
