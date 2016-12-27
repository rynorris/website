package main

import (
	"fmt"
	"github.com/discoviking/website/server/message/email"
	pages "github.com/discoviking/website/server/pages/storage"
	"github.com/discoviking/website/server/storage/dir"
	"log"
	"net/http"
	"time"
)

func main() {
	// Load config.
	conf, err := LoadConfig("./server.yml")
	if err != nil {
		log.Fatal("failed to load config: %v", err)
	}

	storageService, err := dir.NewService("./test/pages")
	if err != nil {
		log.Fatal("failed to create storage service: %v", err)
	}

	pagesService := pages.NewService(storageService)

	messageService := email.NewService(conf.Contact.Email.To)

	router := createRouter(
		conf.Server.Serve.Index,
		conf.Server.Serve.Assets,
		pagesService,
		messageService,
	)

	if conf.Server.Ssl.On {
		// Main server over HTTPS.
		log.Print("SSL On")
		startHttpRedirectServer(conf.Server.Port, conf.Server.Ssl.Port)
		mainSrv := &http.Server{
			Addr:         fmt.Sprintf(":%v", conf.Server.Ssl.Port),
			ReadTimeout:  time.Duration(conf.Server.ReadTimeout) * time.Second,
			WriteTimeout: time.Duration(conf.Server.WriteTimeout) * time.Second,
			// IdleTimeout:  120 * time.Second, // Go 1.8 only.
			TLSConfig: getTlsConfig(),
			Handler:   router,
		}
		log.Print("Begin serving")
		log.Fatal(mainSrv.ListenAndServeTLS(conf.Server.Ssl.Cert, conf.Server.Ssl.Key))
	} else {
		// Main Server over HTTP.
		log.Print("SSL Off")
		mainSrv := &http.Server{
			Addr:         fmt.Sprintf(":%v", conf.Server.Port),
			ReadTimeout:  time.Duration(conf.Server.ReadTimeout) * time.Second,
			WriteTimeout: time.Duration(conf.Server.WriteTimeout) * time.Second,
			// IdleTimeout:  120 * time.Second, // Go 1.8 only.
			Handler: router,
		}
		log.Print("Begin serving")
		log.Fatal(mainSrv.ListenAndServe())
	}
}
