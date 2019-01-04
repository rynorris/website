import HttpJsonService from "./http-json-service";

export interface Site {
    banner: BannerConfig;
    contact: ContactDetails;
    logo: string;
    pages: PageListing[];
}

export interface BannerConfig {
    images: string[];
}

export interface ContactDetails {
    email: string;
    phone: string;
}

export interface PageListing {
    id: string;
    title: string;
}

export class SiteService extends HttpJsonService {
  public loadSite(): Promise<Site> {
    return this.get(`/`);
  }

  public saveSite(site: Site): Promise<any> {
    return this.put(`/`, site);
  }
}
