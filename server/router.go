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

	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "../app/build/src/index.html")
	})

	r.HandleFunc("/app/{path:.*}", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "../app/build/src/index.html")
	})

	appHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "../app/build/src/app.js")
	})
	r.Handle("/app.js", gziphandler.GzipHandler(appHandler))

	fs := http.FileServer(http.Dir("../app/build/src/assets/"))
	r.Handle("/assets/{assetPath:.*}", http.StripPrefix("/assets/", fs))

	storageHandler := storage.NewHandler(storageService)
	r.Handle("/storage/{key}", http.StripPrefix("/storage", storageHandler))

	return r
}
