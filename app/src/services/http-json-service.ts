export default class HttpJsonService {
  private basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  public get(url): any {
    return this.fetch("GET", url, null);
  }

  public post(url, body): any {
    return this.fetch("POST", url, body);
  }

  public fetch(method: string, url: string, body: any): any {
    url = this.basePath + url;

    let requestInit: any = {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    }

    if ((method != "HEAD") && (method != "GET")) {
      requestInit.body = body;
    }

    return (window as any).fetch(url, requestInit);
  }
}
