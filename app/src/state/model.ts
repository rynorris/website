import { UserInfo } from "../services/auth-service";

// State model.
export interface AppState {
  auth: {
    user: UserInfo | null;
  };
  site: {
      pages: string[];
  };
  toaster: {
    open: boolean;
    text: string;
  };
}