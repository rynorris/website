import HttpJsonService from "./http-json-service";

export interface ILoginRequest {
  username: string;
  password: string;
}

export interface IUserInfo {
  username: string;
}

export class AuthService extends HttpJsonService {
  public login(r: ILoginRequest): Promise<void> {
    return this.post<ILoginRequest, void>("/login", r).then(this.rejectNull);
  }

  public logout(): Promise<void> {
    return this.post<null, void>("/logout", null).then(this.rejectNull);
  }

  public whoAmI(): Promise<IUserInfo> {
    return this.get<IUserInfo>("/user").then(this.rejectNull);
  }
}
