package images

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/discoviking/website/server/auth"
	"github.com/gorilla/mux"
)

func AddRoutes(r *mux.Router, service Service, authService auth.Service) {
	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		keys, err := service.List()
		if err != nil {
			http.Error(w, fmt.Sprintf("failed to list images"), 503)
			return
		}
		encoder := json.NewEncoder(w)
		encoder.Encode(keys)
	}).Methods("GET")

	r.HandleFunc("/{key}", func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		key := vars["key"]

		log.Printf("Received request to GET image %v", key)

		image, err := service.Get(key)
		if err != nil {
			http.Error(w, fmt.Sprintf("failed to load image %v", err), 404)
			return
		}

		w.Header().Set("Content-Type", typeToContentType(image.Type))
		w.Write(image.Blob)
	}).Methods("GET")

	r.HandleFunc("/{key}", auth.AuthenticateFunc(authService, func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		key := vars["key"]

		log.Printf("Received request to PUT image %v", key)

		blob, err := ioutil.ReadAll(r.Body)
		if err != nil {
			http.Error(w, fmt.Sprintf("failed to read image from request body: %v", err), 400)
			return
		}

		// Take the image type from the desired filename.
		imageType := keyToType(key)

		// If content-type is set,  then double-check with it.
		contentType := r.Header.Get("Content-Type")
		if len(contentType) > 0 && contentType != typeToContentType(imageType) {
			http.Error(w, fmt.Sprintf("content-type does not match desired file extension"), 400)
			return
		}

		image := Image{
			Type: imageType,
			Blob: blob,
		}
		err = service.Put(key, image)
		if err != nil {
			http.Error(w, fmt.Sprintf("failed to store image: %v", err), 503)
			return
		}

		w.WriteHeader(http.StatusNoContent)
		return
	})).Methods("PUT")

	r.HandleFunc("/{key}", auth.AuthenticateFunc(authService, func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		key := vars["key"]

		log.Printf("Received request to DELETE image %v", key)

		err := service.Delete(key)
		if err != nil {
			http.Error(w, fmt.Sprintf("failed to delete image: %v", err), 503)
		}

		return
	})).Methods("DELETE")
}

func typeToContentType(t ImageType) string {
	switch t {
	case PNG:
		return "image/png"
	case JPG:
		return "image/jpg"
	case GIF:
		return "image/gif"
	default:
		return ""
	}
}
