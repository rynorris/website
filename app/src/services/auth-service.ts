import HttpJsonService from "./http-json-service";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface UserInfo {
  username: string;
}

export class AuthService extends HttpJsonService {
  public login(r: LoginRequest): Promise<any> {
    return this.post("/login", r);
  }

  public logout(): Promise<any> {
    return this.post("/logout", null);
  }

  public whoAmI(): Promise<UserInfo> {
    return this.get("/user");
  }
}
