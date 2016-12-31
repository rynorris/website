import HttpJsonService from "./http-json-service";

export class ImageService extends HttpJsonService {
  public listImages(): Promise<string[]> {
    return this.get("/");
  }

  public getUrl(key: string): string {
    return this.basePath + "/" + key;
  }
}
