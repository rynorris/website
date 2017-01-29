package images

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"

	"github.com/discoviking/website/server/auth"
	"github.com/discoviking/website/server/cache"
	"github.com/gorilla/mux"
)

func AddRoutes(r *mux.Router, service Service, authService auth.Service) {
	etagCache := cache.NewMD5EtagCache()

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

		ifNoneMatch := r.Header.Get("If-None-Match")
		firstQuote := strings.Index(ifNoneMatch, "\"")
		lastQuote := strings.LastIndex(ifNoneMatch, "\"")
		if len(ifNoneMatch) > 0 && firstQuote != -1 && lastQuote > firstQuote {
			etag := ifNoneMatch[firstQuote+1 : lastQuote]
			if etagCache.Matches(cache.Key(key), cache.ETag(etag)) {
				log.Printf("ETag matches,  returning 304 Not Modified")
				w.WriteHeader(304)
				w.Header().Set("ETag", string(ifNoneMatch))
				return
			}
		}

		image, err := service.Get(key)
		if err != nil {
			http.Error(w, fmt.Sprintf("failed to load image %v", err), 404)
			return
		}

		newEtag := etagCache.Put(cache.Key(key), image.Blob)
		log.Printf("Returning ETag: %s", newEtag)
		w.Header().Set("ETag", fmt.Sprintf("\"%s\"", newEtag))
		w.Header().Set("Cache-Control", "max-age=600")

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

		etagCache.Invalidate(cache.Key(key))

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

		etagCache.Invalidate(cache.Key(key))

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
