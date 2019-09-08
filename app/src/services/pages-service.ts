import HttpJsonService from "./http-json-service";

export interface ICard {
  type: "post" | "bio";
  title: string;
  text: string;
  image: string;
}

export interface IPage {
  title: string;
  cards: ICard[];
}

export class PagesService extends HttpJsonService {
  public listPages(): Promise<string[]> {
    return this.get(`/`);
  }

  public loadPage(key: string): Promise<IPage> {
    return this.get(`/${key}`);
  }

  public savePage(key: string, page: IPage): Promise<any> {
    return this.put(`/${key}`, page);
  }
}
