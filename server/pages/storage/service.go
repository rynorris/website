package storage

import (
	"encoding/json"

	"github.com/rynorris/website/server/pages"
	"github.com/rynorris/website/server/storage"
)

type Service struct {
	storage storage.Service
}

func NewService(storage storage.Service) *Service {
	return &Service{
		storage: storage,
	}
}

func (s *Service) List() ([]string, error) {
	return s.storage.List()
}

func (s *Service) Get(key string) (pages.Page, error) {
	page := pages.Page{}

	blob, err := s.storage.Get(key)
	if err != nil {
		return page, err
	}

	err = json.Unmarshal(blob, &page)

	return page, err
}

func (s *Service) Put(key string, page pages.Page) error {
	blob, err := json.Marshal(page)
	if err != nil {
		return err
	}

	return s.storage.Put(key, blob)
}

func (s *Service) Delete(key string) error {
	return s.storage.Delete(key)
}
