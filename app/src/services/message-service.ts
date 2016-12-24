import HttpJsonService from "./http-json-service";

export interface Message {
  sender: string;
  email: string;
  message: string;
}

export class MessageService extends HttpJsonService {
  public send(m: Message) {
    this.post("/send", m);
  }
}
