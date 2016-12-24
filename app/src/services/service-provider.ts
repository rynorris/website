import {MessageService} from "./message-service";

export default class ServiceProvider {
  private messageService: MessageService;

  public MessageService() {
    if (!this.messageService) {
      this.messageService = new MessageService("/api/message");
    }

    return this.messageService;
  }
}
