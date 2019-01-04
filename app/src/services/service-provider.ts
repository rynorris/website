import {AuthService} from "./auth-service";
import {ImageService} from "./image-service";
import {MessageService} from "./message-service";
import {PagesService} from "./pages-service";
import { SiteService } from "./site-service";

export default class ServiceProvider {
  private static authService: AuthService;
  private static imageService: ImageService;
  private static messageService: MessageService;
  private static pagesService: PagesService;
  private static siteService: SiteService;

  public static AuthService() {
    if (!this.authService) {
      this.authService = new AuthService("/api/auth");
    }

    return this.authService;
  }

  public static ImageService() {
    if (!this.imageService) {
      this.imageService = new ImageService("/api/images");
    }

    return this.imageService;
  }

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

  public static SiteService() {
    if (!this.siteService) {
      this.siteService = new SiteService("/api/site");
    }

    return this.siteService;
  }
}
