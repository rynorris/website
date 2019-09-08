import { Action, ActionCreator } from "redux";

import { UserInfo } from "../services/auth-service";
import { Site } from "../services/site-service";

// --- Site state.
export interface SetSiteAction extends Action {
    type: "SITE/SET";
    site: Site;
}
export const SetSite: ActionCreator<SetSiteAction> = (site: Site) => ({ type: "SITE/SET", site });

// --- Login/logout.
export interface LoginAction extends Action {
  type: "LOGIN";
  user: UserInfo;
}
export const Login: ActionCreator<LoginAction> = (user: UserInfo) => ({ type: "LOGIN", user });

export interface LogoutAction extends Action {
  type: "LOGOUT";
}
export const Logout: ActionCreator<LogoutAction> = () => ({ type: "LOGOUT" });

// --- Toasts.
export interface ToastAction extends Action {
  type: "TOAST";
  text: string;
}
export const Toast: ActionCreator<ToastAction> = (text: string) => ({ type: "TOAST", text });

export interface CloseToastAction extends Action {
  type: "CLOSE-TOAST";
}
export const CloseToast: ActionCreator<CloseToastAction> = () => ({ type: "CLOSE-TOAST" });
