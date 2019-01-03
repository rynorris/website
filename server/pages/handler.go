package pages

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
		keys, err := service.List()
		if err != nil {
			http.Error(w, fmt.Sprintf("failed to list pages"), 503)
			return
		}
		encoder := json.NewEncoder(w)
		encoder.Encode(keys)
	}).Methods("GET")

	r.HandleFunc("/{key}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		key := vars["key"]

		log.Printf("Received request to GET post %v", key)

		page, err := service.Get(key)
		if err != nil {
			http.Error(w, fmt.Sprintf("failed to load object %v", err), 404)
			return
		}

		encoder := json.NewEncoder(w)
		err = encoder.Encode(page)
		if err != nil {
			http.Error(w, fmt.Sprintf("failed to write page to response %v", err), 503)
			return
		}

		return
	}).Methods("GET")

	r.HandleFunc("/{key}", auth.AuthenticateFunc(authService, func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		key := vars["key"]

		log.Printf("Received request to PUT post %v", key)

		decoder := json.NewDecoder(r.Body)
		page := Page{}
		err := decoder.Decode(&page)
		if err != nil {
			http.Error(w, fmt.Sprintf("failed to decode page from request body: %v", err), 400)
			return
		}

		err = service.Put(key, page)
		if err != nil {
			http.Error(w, fmt.Sprintf("failed to store page: %v", err), 503)
			return
		}

		w.WriteHeader(http.StatusNoContent)
		return
	})).Methods("PUT")

	r.HandleFunc("/{key}", auth.AuthenticateFunc(authService, func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		key := vars["key"]

		log.Printf("Received request to DELETE post %v", key)

		err := service.Delete(key)
		if err != nil {
			http.Error(w, fmt.Sprintf("failed to delete page: %v", err), 503)
		}

		return
	})).Methods("DELETE")
}
