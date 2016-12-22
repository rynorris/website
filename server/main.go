package main

import (
	"fmt"
	"github.com/NYTimes/gziphandler"
	"github.com/gorilla/mux"
	"log"
	"net/http"
	"time"
)

func main() {
	// Load Config.
	conf, err := LoadConfig("./server.yml")
	if err != nil {
		log.Fatal("failed to load config: %v", err)
	}
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

	if conf.Ssl.On {
		// Main server over HTTPS.
		startHttpRedirectServer(conf.Port)
		mainSrv := &http.Server{
			Addr:         fmt.Sprintf(":%v", conf.Ssl.Port),
			ReadTimeout:  time.Duration(conf.ReadTimeout) * time.Second,
			WriteTimeout: time.Duration(conf.WriteTimeout) * time.Second,
			// IdleTimeout:  120 * time.Second, // Go 1.8 only.
			TLSConfig: getTlsConfig(),
			Handler:   r,
		}
		log.Fatal(mainSrv.ListenAndServeTLS(conf.Ssl.Cert, conf.Ssl.Key))
	} else {
		// Main Server over HTTP.
		mainSrv := &http.Server{
			Addr:         fmt.Sprintf(":%v", conf.Port),
			ReadTimeout:  time.Duration(conf.ReadTimeout) * time.Second,
			WriteTimeout: time.Duration(conf.WriteTimeout) * time.Second,
			// IdleTimeout:  120 * time.Second, // Go 1.8 only.
			Handler: r,
		}
		log.Fatal(mainSrv.ListenAndServe())
	}
}
