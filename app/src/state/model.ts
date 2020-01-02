import { Action, AnyAction } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { IUserInfo } from "../services/auth-service";
import { ISite } from "../services/site-service";

// State model.
export interface IAppState {
  auth: {
    user: IUserInfo | null;
  };
  image: {
    list: string[],
  };
  site?: ISite;
  toaster: {
    open: boolean;
    text: string;
  };
}

export type AppDispatch = ThunkDispatch<IAppState, null, AnyAction>;

export type AppThunk = ThunkAction<void, IAppState, null, Action>;
