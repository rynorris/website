import { UserInfo } from "../services/auth-service";

// State model.
export interface AppState {
  auth: {
    user: UserInfo | null;
  };
  toaster: {
    open: boolean;
    text: string;
  };
}