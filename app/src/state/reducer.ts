import { Action, Reducer } from "redux";

import { ILoginAction, ISetImageListAction, ISetSiteAction, IToastAction } from "./actions";
import { IAppState } from "./model";

// Initial State.
const initialState: IAppState = {
  auth: {
    user: null,
  },
  image: {
    list: [],
  },
  toaster: {
    open: false,
    text: "",
  },
};

export const appReducer: Reducer<IAppState> = (state = initialState, action: Action) => {
  switch (action.type) {
    case "SITE/SET":
      return { ...state, site: (action as ISetSiteAction).site };

    case "LOGIN":
      return { ...state, auth: { user: (action as ILoginAction).user } };

    case "LOGOUT":
      return { ...state, auth: { user: null } };

    case "TOAST":
      return { ...state, toaster: { open: true, text: (action as IToastAction).text } };

    case "CLOSE-TOAST":
      return { ...state, toaster: { open: false, text: "" } };

    case "IMAGE/LIST/SET":
      return { ...state, image: { ...state.image, list: (action as ISetImageListAction).list } };

    default:
      return state;
  }
};
