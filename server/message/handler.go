package message

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"log"
	"net/http"
)

func AddRoutes(r *mux.Router, service Service) {
	r.HandleFunc("/send", func(w http.ResponseWriter, r *http.Request) {
		log.Print("Received request to send message")
		m := Message{}
		d := json.NewDecoder(r.Body)
		d.Decode(&m)
		service.Send(m)
	}).Methods("POST")
}
