import * as React from "react";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";

import {Login, store} from "../redux/state";

interface ILoginWidgetState {
  loggedIn: boolean;
}

export default class LoginWidget extends React.Component<{}, ILoginWidgetState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      loggedIn: false,
    };
  }

  componentDidMount() {
    store.subscribe(() => {
      let loggedIn = store.getState().auth.loggedIn;
      if (loggedIn !== this.state.loggedIn) {
        this.setState(Object.assign({}, this.state, { loggedIn: loggedIn }));
      }
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
          <FlatButton label="Login" onTouchTap={this.handleLogin.bind(this)} />
        </div>
      );
    }
  }

  private handleLogin() {
    store.dispatch(Login());
  }
}
