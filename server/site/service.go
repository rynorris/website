package site

type Site struct {
	Banner  BannerConfig  `json:"banner"`
	Contact ContactInfo   `json:"contact"`
	Logo    string        `json:"logo"`
	Pages   []PageListing `json:"pages"`
	Title   string        `json:"title"`
	Theme   ThemeConfig   `json:"theme"`
}

type BannerConfig struct {
	Images []string `json:"images"`
}

type ContactInfo struct {
	Email string `json:"email"`
	Phone string `json:"phone"`
}

type PageListing struct {
	Id    string `json:"id"`
	Title string `json:"title"`
}

type ThemeConfig struct {
	Colors ThemeColors `json:"colors"`
}

type ThemeColors struct {
	Primary    string `json:"primary"`
	Secondary  string `json:"secondary"`
	Background string `json:"background"`
	Error      string `json:"error"`
}

type Service interface {
	Get() (Site, error)
	Put(Site) error
}
