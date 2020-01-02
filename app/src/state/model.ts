import { IUserInfo } from "../services/auth-service";
import { ISite } from "../services/site-service";

// State model.
export interface IAppState {
  auth: {
    user: IUserInfo | null;
  };
  site?: ISite;
  toaster: {
    open: boolean;
    text: string;
  };
}
