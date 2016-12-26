package email

import (
	"github.com/discoviking/website/server/message"
	"log"
)

type Service struct {
	target string
}

func NewService(target string) *Service {
	return &Service{
		target: target,
	}
}

func (s *Service) Send(m message.Message) error {
	// Send email.
	log.Printf("Send Email to %v: %#v", s.target, m)
	return nil
}
