import * as React from "react";
import {Dispatch} from "redux";
import Button from "@material-ui/core/Button";

import LoginWindow from "./login-window";
import Toaster from "./toaster";
import {UserInfo} from "../services/auth-service";
import ServiceProvider from "../services/service-provider";

import { Login, Logout, LogoutAction, LoginAction } from "../state/actions";
import { AppState } from "../state/model";
import { connect } from "react-redux";

interface IStateProps {
  user: UserInfo | null;
}

interface IDispatchProps {
  onLogin: (user: UserInfo) => void;
  onLogout: () => void;
}

type LoginWidgetProps = IStateProps & IDispatchProps;

interface ILoginWidgetState {
  dialogOpen: boolean;
}

class UnconnectedLoginWidget extends React.Component<LoginWidgetProps, ILoginWidgetState> {

  constructor(props: LoginWidgetProps) {
    super(props);
    this.state = {
      dialogOpen: false,
    };
  }

  componentDidMount() {
    const auth = ServiceProvider.AuthService();

    (async () => {
      try {
        const user = await auth.whoAmI();
        if (user !== null) {
          this.props.onLogin(user);
        } else {
          this.props.onLogout();
        }
      } catch (error) {
        this.props.onLogout();
      }
    })();
  }

  render() {
    const { user } = this.props;

    let loginButton: JSX.Element;
    if (user) {
      loginButton = <Button onClick={this.doLogout.bind(this)}>Logout</Button>;
    } else {
      loginButton = <Button onClick={this.openDialog.bind(this)}>Login</Button>;
    }

    return (
      <div className="login-widget">
        {user ? <span>Logged in as {user.username}</span> : null}
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
      this.props.onLogout();
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

const mapStateToProps = (state: AppState) => ({
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch: Dispatch<LoginAction | LogoutAction>) => ({
  onLogin: (user: UserInfo) => dispatch(Login(user)),
  onLogout: () => dispatch(Logout()),
});

export const LoginWidget = connect(mapStateToProps, mapDispatchToProps)(UnconnectedLoginWidget);
