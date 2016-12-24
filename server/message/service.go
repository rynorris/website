package message

type Message struct {
	sender  string
	email   string
	message string
}

type Service interface {
	Send(m Message) error
}
