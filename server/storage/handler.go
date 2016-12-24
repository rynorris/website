package storage

import (
	"fmt"
	"github.com/gorilla/mux"
	"net/http"
)

func Handler(service Service) http.Handler {
	r := mux.NewRouter()

	r.HandleFunc("/{key}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		key := vars["key"]

		blob, err := service.Get(key)
		if err != nil {
			http.Error(w, fmt.Sprintf("failed to load object %v", err), 404)
			return
		}

		n, err := w.Write(blob)
		if err != nil {
			http.Error(w, fmt.Sprintf("failed to write object %v", err), 503)
			return
		}

		if n != len(blob) {
			http.Error(w, "failed to write out object", 503)
			return
		}

		return
	}).Methods("GET")

	return r
}
