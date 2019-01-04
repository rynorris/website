package pages

type CardType string

type Card struct {
	Type      CardType `json:"type"`
	Title     string   `json:"title"`
	Text      string   `json:"text"`
	ImageLink string   `json:"image"`
}

type Page struct {
	Title string `json:"title"`
	Cards []Card `json:"cards"`
}

type Service interface {
	List() ([]string, error)
	Get(key string) (Page, error)
	Put(key string, page Page) error
	Delete(key string) error
}
