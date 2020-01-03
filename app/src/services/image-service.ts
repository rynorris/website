import HttpJsonService from "./http-json-service";

const contentTypeFromKey = (key: string): string => {
  const extIx = key.lastIndexOf(".");
  if (extIx === -1) {
    // Take a guess?
    return "image/unknown";
  }

  const extension = key.slice(extIx + 1);

  switch (extension) {
    case "jpg":
      return "image/jpg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    default:
      return "image/unknown";
  }
};

export class ImageService extends HttpJsonService {
  public async listImages(): Promise<string[]> {
    const list = await this.get<string[]>("/");
    return list != null ? list : [];
  }

  public putImage(key: string, blob: Blob): Promise<void | null> {
    return this.rawFetch(
      "PUT",
      "/" + key,
      (_) => Promise.resolve<void>(undefined),
      blob,
      contentTypeFromKey(key),
    );
  }

  public getUrl(key: string): string {
    return this.basePath + "/" + key;
  }
}
