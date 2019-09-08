import { UserInfo } from "../services/auth-service";
import { Site } from "../services/site-service";

// State model.
export interface AppState {
  auth: {
    user: UserInfo | null;
  };
  site: Site;
  toaster: {
    open: boolean;
    text: string;
  };
}
