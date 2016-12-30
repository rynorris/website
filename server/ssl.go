package main

import (
	"crypto/tls"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"golang.org/x/crypto/acme/autocert"
)

func getTlsConfig(useAcme bool, cacheDir string, domains []string) *tls.Config {
	config := &tls.Config{
		// Causes servers to use Go's default ciphersuite preferences,
		// which are tuned to avoid attacks. Does nothing on clients.
		PreferServerCipherSuites: true,
		// Only use curves which have assembly implementations
		CurvePreferences: []tls.CurveID{
			tls.CurveP256,
			// tls.X25519, // Go 1.8 only
		},
		MinVersion: tls.VersionTLS12,
		CipherSuites: []uint16{
			tls.TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384,
			tls.TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,
			// tls.TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305, // Go 1.8 only
			// tls.TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305,   // Go 1.8 only
			tls.TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256,
			tls.TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256,

			// Best disabled, as they don't provide Forward Secrecy,
			// but might be necessary for some clients
			// tls.TLS_RSA_WITH_AES_256_GCM_SHA384,
			// tls.TLS_RSA_WITH_AES_128_GCM_SHA256,
		},
	}

	// If desired used ACME to automatically get a certificate.
	if useAcme {
		cache := autocert.DirCache(cacheDir)
		hostPolicy := autocert.HostWhitelist(domains...)

		m := autocert.Manager{
			Prompt:     autocert.AcceptTOS,
			Cache:      cache,
			HostPolicy: hostPolicy,
		}

		config.GetCertificate = m.GetCertificate
	}

	return config
}

func startHttpRedirectServer(fromPort, toPort int) {
	// Redirect http to https.
	redirectSrv := &http.Server{
		Addr:         fmt.Sprintf(":%v", fromPort),
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 5 * time.Second,
		Handler: http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
			w.Header().Set("Connection", "close")
			host := req.Host
			httpsHost := strings.Split(host, ":")[0] + fmt.Sprintf(":%v", toPort)
			url := "https://" + httpsHost + req.URL.String()
			http.Redirect(w, req, url, http.StatusMovedPermanently)
		}),
	}
	go func() { log.Fatal(redirectSrv.ListenAndServe()) }()
}
