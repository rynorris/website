import { Action, ActionCreator } from "redux";

import { UserInfo } from "../services/auth-service";

// Actions.
export interface LoginAction extends Action {
  type: "LOGIN";
  user: UserInfo;
}
export let Login: ActionCreator<LoginAction> = (user: UserInfo) => { return {type: "LOGIN", user: user}; };

export interface LogoutAction extends Action {
  type: "LOGOUT";
}
export let Logout: ActionCreator<LogoutAction> = () => { return {type: "LOGOUT"}; };

export interface ToastAction extends Action {
  type: "TOAST";
  text: string;
}
export let Toast: ActionCreator<ToastAction> = (text: string) => {
  return {type: "TOAST", text: text};
};

export interface CloseToastAction extends Action {
  type: "CLOSE-TOAST";
}
export let CloseToast: ActionCreator<CloseToastAction> = () => { return {type: "CLOSE-TOAST"}; };
