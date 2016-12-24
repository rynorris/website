package main

import (
	"fmt"
	"github.com/discoviking/website/server/message/email"
	"github.com/discoviking/website/server/storage/dir"
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

	storageService, err := dir.NewService("./storage")
	if err != nil {
		log.Fatal("failed to create storage service: %v", err)
	}

	messageService := email.NewService("test@email.com")

	router := createRouter(storageService, messageService)

	if conf.Ssl.On {
		// Main server over HTTPS.
		startHttpRedirectServer(conf.Port)
		mainSrv := &http.Server{
			Addr:         fmt.Sprintf(":%v", conf.Ssl.Port),
			ReadTimeout:  time.Duration(conf.ReadTimeout) * time.Second,
			WriteTimeout: time.Duration(conf.WriteTimeout) * time.Second,
			// IdleTimeout:  120 * time.Second, // Go 1.8 only.
			TLSConfig: getTlsConfig(),
			Handler:   router,
		}
		log.Fatal(mainSrv.ListenAndServeTLS(conf.Ssl.Cert, conf.Ssl.Key))
	} else {
		// Main Server over HTTP.
		mainSrv := &http.Server{
			Addr:         fmt.Sprintf(":%v", conf.Port),
			ReadTimeout:  time.Duration(conf.ReadTimeout) * time.Second,
			WriteTimeout: time.Duration(conf.WriteTimeout) * time.Second,
			// IdleTimeout:  120 * time.Second, // Go 1.8 only.
			Handler: router,
		}
		log.Fatal(mainSrv.ListenAndServe())
	}
}
