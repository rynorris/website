import HttpJsonService from "./http-json-service";

export interface ILoginRequest {
  username: string;
  password: string;
}

export interface IUserInfo {
  username: string;
}

export class AuthService extends HttpJsonService {
  public login(r: ILoginRequest): Promise<null> {
    return this.post<ILoginRequest, null>("/login", r);
  }

  public logout(): Promise<null> {
    return this.post<null, null>("/logout", null);
  }

  public whoAmI(): Promise<IUserInfo> {
    return this.get<IUserInfo>("/user").then(this.rejectNull);
  }
}
