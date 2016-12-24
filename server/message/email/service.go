package email

import (
	"github.com/discoviking/website/server/message"
)

type Service struct {
	target string
}

func NewService(target string) *Service {
	return &Service{
		target: target,
	}
}

func (s *Service) Send(m message.Message) {
	// Send email.
}
