package main

import (
	"github.com/NYTimes/gziphandler"
	"github.com/discoviking/website/server/storage"
	"github.com/gorilla/mux"
	"net/http"
)

func createRouter(storageService storage.Service) *mux.Router {
	// Main Router.
	r := mux.NewRouter()

	storageHandler := storage.NewHandler(storageService)
	r.Handle("/storage/{key}", http.StripPrefix("/storage", storageHandler))

	appHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "../app/build/src/app.js")
	})
	r.Handle("/app.js", gziphandler.GzipHandler(appHandler))

	// Serve static assets.
	fs := http.FileServer(http.Dir("../app/build/src/assets/"))
	r.PathPrefix("/assets/").Handler(http.StripPrefix("/assets/", fs))

	// For all other paths just serve the app and defer to the front-end to handle it.
	r.PathPrefix("/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "../app/build/src/index.html")
	})

	return r
}
