import HttpJsonService from "./http-json-service";

export interface ISite {
  banner: IBannerConfig;
  contact: IContactDetails;
  logo: string;
  pages: IPageListing[];
  title: string;
  theme: ITheme;
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

export interface ITheme {
  colors: IThemeColors;
}

export interface IThemeColors {
  primary: string;
  secondary: string;
  background: string;
  error: string;
}

export class SiteService extends HttpJsonService {
  public loadSite(): Promise<ISite> {
    return this.get<ISite>(`/`).then(this.rejectNull);
  }

  public saveSite(site: ISite): Promise<void> {
    return this.put<ISite, void>(`/`, site).then(this.rejectNull);
  }
}
