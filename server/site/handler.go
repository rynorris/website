package site

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rynorris/website/server/auth"
)

func AddRoutes(r *mux.Router, service Service, authService auth.Service) {
	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		site, err := service.Get()
		if err != nil {
			http.Error(w, fmt.Sprintf("failed to get site: %v", err), 503)
			return
		}

		encoder := json.NewEncoder(w)
		encoder.Encode(site)
	}).Methods("GET")

	r.HandleFunc("/", auth.AuthenticateFunc(authService, func(w http.ResponseWriter, r *http.Request) {
		log.Printf("Recieved request to PUT site")
		decoder := json.NewDecoder(r.Body)
		site := Site{}
		err := decoder.Decode(&site)
		if err != nil {
			http.Error(w, fmt.Sprintf("failed to decode site from request body: %v", err), 400)
			return
		}

		err = service.Put(site)
		if err != nil {
			http.Error(w, fmt.Sprintf("failed to store site: %v", err), 503)
			return
		}

		w.WriteHeader(http.StatusNoContent)
		return
	})).Methods("PUT")
}
