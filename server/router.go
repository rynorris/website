package main

import (
	"github.com/NYTimes/gziphandler"
	"github.com/discoviking/website/server/message"
	"github.com/discoviking/website/server/storage"
	"github.com/gorilla/mux"
	"net/http"
)

func createRouter(storageService storage.Service, messageService message.Service) *mux.Router {
	// Main Router.
	r := mux.NewRouter()

	// REST API.
	api := r.PathPrefix("/api/").Subrouter()

	messageHandler := message.Handler(messageService)
	api.PathPrefix("/message/").Handler(http.StripPrefix("/message/", messageHandler))

	storageHandler := storage.NewHandler(storageService)
	r.Handle("/storage/{key}", http.StripPrefix("/storage", storageHandler))

	// Serve static assets.
	fs := http.FileServer(http.Dir("../app/build/src/assets/"))
	fs = gziphandler.GzipHandler(fs)
	r.PathPrefix("/assets/").Handler(http.StripPrefix("/assets/", fs))

	// For all other paths just serve the app and defer to the front-end to handle it.
	r.PathPrefix("/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "../app/build/src/assets/index.html")
	})

	return r
}
