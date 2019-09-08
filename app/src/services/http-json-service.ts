export default class HttpJsonService {
  protected basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  public get(url: string): Promise<any> {
    return this.fetch("GET", url, null);
  }

  public post(url: string, body: any): Promise<any> {
    return this.fetch("POST", url, body);
  }

  public put(url: string, body: any): Promise<any> {
    return this.fetch("PUT", url, body);
  }

  public fetch(method: string, url: string, body: any): Promise<any> {
    url = this.basePath + url;

    const requestInit: any = {
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      method,
    };

    if ((method !== "HEAD") && (method !== "GET")) {
      requestInit.body = JSON.stringify(body);
    }

    return ((window as any).fetch(url, requestInit)
                           .then(this.checkStatus)
                           .then(this.parseJson,
                                 this.parseError));
  }

  private checkStatus(response: any): Promise<any> {
    if (response.status >= 400) {
      return Promise.reject(response);
    }
    return response;
  }

  private parseJson(response: any): Promise<any> {
    if (response.status === 204) {
      return Promise.resolve(null);
    }
    return response.json();
  }

  private parseError(response: any): Promise<any> {
    return response.json().then((data: any) => Promise.reject(data));
  }
}
