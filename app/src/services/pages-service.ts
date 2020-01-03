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
  public async listPages(): Promise<string[]> {
    const list = await this.get<string[]>(`/`);
    return list != null ? list : [];
  }

  public async loadPage(key: string): Promise<IPage> {
    return this.get<IPage>(`/${key}`).then(this.rejectNull);
  }

  public savePage(key: string, page: IPage): Promise<null | void> {
    return this.put<IPage, void>(`/${key}`, page);
  }
}
