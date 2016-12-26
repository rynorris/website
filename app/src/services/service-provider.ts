import {MessageService} from "./message-service";
import {PagesService} from "./pages-service";

export default class ServiceProvider {
  private static messageService: MessageService;
  private static pagesService: PagesService;

  public static MessageService() {
    if (!this.messageService) {
      this.messageService = new MessageService("/api/message");
    }

    return this.messageService;
  }

  public static PagesService() {
    if (!this.pagesService) {
      this.pagesService = new PagesService("/api/pages");
    }

    return this.pagesService;
  }
}
