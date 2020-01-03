export default class HttpJsonService {
  protected basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  public get<R>(url: string): Promise<R | null> {
    return this.jsonFetch("GET", url, null);
  }

  public post<T, R>(url: string, body: T): Promise<R | null> {
    return this.jsonFetch("POST", url, body);
  }

  public put<T, R>(url: string, body: T): Promise<R | null> {
    return this.jsonFetch("PUT", url, body);
  }

  protected jsonFetch<T, R>(method: string, url: string, body: T): Promise<R | null> {
    const jsonBody = body == null ? undefined : JSON.stringify(body);
    return this.rawFetch(method, url, (response) => this.parseJson<R>(response), jsonBody, "application/json");
  }

  protected rawFetch<R>(
    method: string,
    url: string,
    handleResponse: (r: Response) => R | null | PromiseLike<R | null>,
    body?: BodyInit,
    contentType?: string,
  ): Promise<R | null> {
    url = this.basePath + url;

    const requestInit: RequestInit = {
      credentials: "same-origin",
      method,
    };

    if ((method !== "HEAD") && (method !== "GET") && (body != null)) {
      if (contentType == null) {
        throw new Error("Must provide content-type POST or PUT requests with body");
      }
      requestInit.body = body;
      requestInit.headers = {
        "Content-Type": contentType,
      };
    }

    return window
      .fetch(url, requestInit)
      .then<Response>(this.checkStatus)
      .then<R | null>(handleResponse, this.parseError);
  }

  protected parseJson<T>(response: Response): Promise<T | null> {
    return this.handleBody(response, (body: Body) => body.json());
  }

  protected parseBlob(response: Response): Promise<Blob | null> {
    return this.handleBody(response, (body: Body) => body.blob());
  }

  protected rejectNull<T>(value: T | null): Promise<T> {
    if (value == null) {
      return Promise.reject<T>("Got unexpected empty response");
    }
    return Promise.resolve(value);
  }

  private checkStatus(response: Response): Promise<Response> | Response {
    if (response.status >= 400) {
      return Promise.reject<Response>(response);
    }
    return response;
  }

  private handleBody<T>(response: Response, extract: (body: Body) => Promise<T>): Promise<T | null> {
    if (response.status === 204) {
      return Promise.resolve(null);
    }
    return extract(response);
  }

  private parseError<T>(response: Response): Promise<T> {
    return response.text().then((data: string) => Promise.reject<T>(data));
  }
}
