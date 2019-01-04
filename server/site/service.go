package site

type Site struct {
	Banner BannerConfig  `json:"banner"`
	Pages  []PageListing `json:"pages"`
}

type BannerConfig struct {
	Images []string `json:"images"`
}

type PageListing struct {
	Id    string `json:"id"`
	Title string `json:"title"`
}

type Service interface {
	Get() (Site, error)
	Put(Site) error
}
