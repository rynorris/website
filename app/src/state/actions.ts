import { Action, ActionCreator } from "redux";

import { IUserInfo } from "../services/auth-service";
import { ISite } from "../services/site-service";

// --- Site state.
export interface ISetSiteAction extends Action {
  type: "SITE/SET";
  site: ISite;
}
export const SetSite: ActionCreator<ISetSiteAction> = (site: ISite) => ({ type: "SITE/SET", site });

// --- Login/logout.
export interface ILoginAction extends Action {
  type: "LOGIN";
  user: IUserInfo;
}
export const Login: ActionCreator<ILoginAction> = (user: IUserInfo) => ({ type: "LOGIN", user });

export interface ILogoutAction extends Action {
  type: "LOGOUT";
}
export const Logout: ActionCreator<ILogoutAction> = () => ({ type: "LOGOUT" });

// --- Toasts.
export interface IToastAction extends Action {
  type: "TOAST";
  text: string;
}
export const Toast: ActionCreator<IToastAction> = (text: string) => ({ type: "TOAST", text });

export interface ICloseToastAction extends Action {
  type: "CLOSE-TOAST";
}
export const CloseToast: ActionCreator<ICloseToastAction> = () => ({ type: "CLOSE-TOAST" });

export interface ISetImageListAction extends Action {
  type: "IMAGE/LIST/SET";
  list: string[];
}

export const SetImageList: ActionCreator<ISetImageListAction> = (list: string[]) => ({ type: "IMAGE/LIST/SET", list });
