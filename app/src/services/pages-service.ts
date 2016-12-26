import HttpJsonService from "./http-json-service";

export interface Card {
  type: "post" | "bio";
  title: string;
  text: string;
  image: string;
}

export interface Page {
  title: string;
  cards: Card[];
}

export class PagesService extends HttpJsonService {
  public loadPage(key: string): Promise<Page> {
    return this.get(`/${key}`);
  }

  public savePage(key: string, page: Page): Promise<any> {
    return this.post(`/${key}`, page);
  }
}
