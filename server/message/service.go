package message

type Message struct {
	Sender  string `json:"sender"`
	Email   string `json:"email"`
	Message string `json:"message"`
}

type Service interface {
	Send(m Message) error
}
