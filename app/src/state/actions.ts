import { Action, ActionCreator } from "redux";

import { UserInfo } from "../services/auth-service";

// --- Page state.
export interface SetPagesAction extends Action {
    type: "PAGES/SET";
    pages: string[];
}
export const SetPages: ActionCreator<SetPagesAction> = (pages: string[]) => ({ type: "PAGES/SET", pages });

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
