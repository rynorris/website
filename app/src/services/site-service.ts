import HttpJsonService from "./http-json-service";

export interface ISite {
    banner: IBannerConfig;
    contact: IContactDetails;
    logo: string;
    pages: IPageListing[];
    title: string;
}

export interface IBannerConfig {
    images: string[];
}

export interface IContactDetails {
    email: string;
    phone: string;
}

export interface IPageListing {
    id: string;
    title: string;
}

export class SiteService extends HttpJsonService {
  public loadSite(): Promise<ISite> {
    return this.get(`/`);
  }

  public saveSite(site: ISite): Promise<any> {
    return this.put(`/`, site);
  }
}
