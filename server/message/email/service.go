package email

import (
	"bytes"
	"github.com/discoviking/website/server/message"
	"log"
	"net/smtp"
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
	log.Printf("Send Email from %v to %v", m.Email, s.target)

	// Build email mesasge as described in net/smtp docs.
	b := bytes.Buffer{}

	b.WriteString("From: ")
	b.WriteString(m.Email)
	b.WriteString("\r\n")

	b.WriteString("To: ")
	b.WriteString(s.target)
	b.WriteString("\r\n")

	b.WriteString("Subject: ")
	b.WriteString("Message from " + m.Sender + " via webform")
	b.WriteString("\r\n")

	// Separate body from headers by empty line.
	b.WriteString("\r\n")

	b.WriteString(m.Message)

	log.Print(b.String())
	b.Reset()

	// Send using local mail server.
	err := smtp.SendMail("localhost:smtp", nil, m.Email, []string{s.target}, b.Bytes())

	return err
}
