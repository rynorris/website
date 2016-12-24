package message

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"net/http"
)

func Handler(service Service) http.Handler {
	r := mux.NewRouter()

	r.HandleFunc("/send", func(w http.ResponseWriter, r *http.Request) {
		m := Message{}
		d := json.NewDecoder(r.Body)
		d.Decode(&m)
		service.Send(m)
	}).Methods("POST")

	return r
}
