package site

type Site struct {
	Pages []PageListing `json:"pages"`
}

type PageListing struct {
	Id    string `json:"id"`
	Title string `json:"title"`
}

type Service interface {
	Get() (Site, error)
	Put(Site) error
}
