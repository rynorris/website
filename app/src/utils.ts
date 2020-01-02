import { ISite } from "./services/site-service";

export const getInjectedConfiguration = (): ISite | undefined => {
    const configElements = document.getElementsByName("x-site-configuration");
    if (configElements.length !== 1) {
        return undefined;
    }

    const content = configElements[0].getAttribute("content");
    if (content == null) {
        return undefined;
    }

    const siteConfig = JSON.parse(content);
    return siteConfig;
};
