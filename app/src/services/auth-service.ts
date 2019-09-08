import HttpJsonService from "./http-json-service";

export interface ILoginRequest {
  username: string;
  password: string;
}

export interface IUserInfo {
  username: string;
}

export class AuthService extends HttpJsonService {
  public login(r: ILoginRequest): Promise<any> {
    return this.post("/login", r);
  }

  public logout(): Promise<any> {
    return this.post("/logout", null);
  }

  public whoAmI(): Promise<IUserInfo> {
    return this.get("/user");
  }
}
