import {MessageService} from "./message-service";

export default class ServiceProvider {
  private static messageService: MessageService;

  public static MessageService() {
    if (!this.messageService) {
      this.messageService = new MessageService("/api/message");
    }

    return this.messageService;
  }
}
