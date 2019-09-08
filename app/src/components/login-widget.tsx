import Button from "@material-ui/core/Button";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import {Dispatch} from "redux";

import {UserInfo} from "../services/auth-service";
import ServiceProvider from "../services/service-provider";
import { LoginWindow } from "./login-window";

import { connect } from "react-redux";
import { Login, LoginAction, Logout, LogoutAction, Toast, ToastAction } from "../state/actions";
import { AppState } from "../state/model";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loginWidget: {
      position: "absolute",
      right: 0,
      zIndex: 1000,
    },
  }),
);

interface IStateProps {
  user: UserInfo | null;
}

interface IDispatchProps {
  onLogin: (user: UserInfo) => void;
  onLogout: () => void;
  toast: (text: string) => void;
}

type LoginWidgetProps = IStateProps & IDispatchProps;

const UnconnectedLoginWidget: React.SFC<LoginWidgetProps> = (props) => {
  const classes = useStyles();
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
  const { user, onLogin, onLogout, toast } = props;

  React.useEffect(() => {
    if (user === null) {
      const auth = ServiceProvider.AuthService();
      (async () => {
        try {
          const user = await auth.whoAmI();
          if (user !== null) {
            onLogin(user);
          } else {
            onLogout();
          }
        } catch (error) {
          onLogout();
        }
      })();
    }
  });

  const doLogout = () => {
    const auth = ServiceProvider.AuthService();
    (async () => {
      try {
        await auth.logout();
        onLogout();
        toast("Logged out");
      } catch (error) {
        console.error("Failed to log out", error);
        toast("Failed to log out");
      }
    })();
  };

  const onLoginSuccess = () => {
    toast("Login Successful");
    setDialogOpen(false);
  };

  const onLoginFailure = () => {
    toast("Login Failed");
  };

  const loginButton = user !== null ? (
    <Button onClick={doLogout}>Logout</Button>
  ) : (
    <Button onClick={() => setDialogOpen(true)}>Login</Button>
  );

  return (
    <div className={classes.loginWidget}>
      {user ? <Typography display="inline">Logged in as {user.username}</Typography> : null}
      {loginButton}
      <LoginWindow
        open={dialogOpen}
        onRequestClose={() => setDialogOpen(false)}
        onSuccess={onLoginSuccess}
        onFailure={onLoginFailure}
        />
    </div>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch: Dispatch<LoginAction | LogoutAction | ToastAction>) => ({
  onLogin: (user: UserInfo) => dispatch(Login(user)),
  onLogout: () => dispatch(Logout()),
  toast: (text: string) => dispatch(Toast(text)),
});

export const LoginWidget = connect(mapStateToProps, mapDispatchToProps)(UnconnectedLoginWidget);
