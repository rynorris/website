import { getFileExtension } from "../utils";
import HttpJsonService from "./http-json-service";

const contentTypeFromKey = (key: string): string => {
  const extension = getFileExtension(key);

  switch (extension) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    default:
      return "image/unknown";
  }
};

export const transformUrl = (url: string, transform: string): string => {
  return url + "?transform=" + transform;
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
