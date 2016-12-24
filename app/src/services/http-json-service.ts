export default class HttpJsonService {
  private basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  public get(url: string): any {
    return this.fetch("GET", url, null);
  }

  public post(url: string, body: any): any {
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
      requestInit.body = JSON.stringify(body);
    }

    return (window as any).fetch(url, requestInit);
  }
}
