package message

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func AddRoutes(r *mux.Router, service Service) {
	r.HandleFunc("/send", func(w http.ResponseWriter, r *http.Request) {
		log.Print("Received request to send message")
		m := Message{}
		d := json.NewDecoder(r.Body)
		d.Decode(&m)

		err := service.Send(m)
		if err != nil {
			log.Printf("failed to send message: %v", err)
			http.Error(w, "failed to send message", 503)
		}
	}).Methods("POST")
}
