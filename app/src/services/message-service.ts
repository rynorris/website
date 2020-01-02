import HttpJsonService from "./http-json-service";

export interface IMessage {
  sender: string;
  email: string;
  message: string;
}

export class MessageService extends HttpJsonService {
  public send(m: IMessage): Promise<void> {
    return this.post<IMessage, void>("/send", m).then(this.rejectNull);
  }
}
