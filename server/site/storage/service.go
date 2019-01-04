package storage

import (
	"encoding/json"

	"github.com/rynorris/website/server/site"
	"github.com/rynorris/website/server/storage"
)

const dummyKey = "site-configuration"

type Service struct {
	storage storage.Service
}

func NewService(storage storage.Service) *Service {
	return &Service{
		storage: storage,
	}
}

func (s *Service) Get() (site.Site, error) {
	site := site.Site{}

	blob, err := s.storage.Get(dummyKey)
	if err != nil {
		return site, err
	}

	err = json.Unmarshal(blob, &site)

	return site, err
}

func (s *Service) Put(site site.Site) error {
	blob, err := json.Marshal(site)
	if err != nil {
		return err
	}

	return s.storage.Put(dummyKey, blob)
}
