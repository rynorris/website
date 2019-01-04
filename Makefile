
.PHONY: app app-deps app-prod app-clean app-clean-prod server server-deps server-prod deps dist-clean dist

app-deps:
	pushd app && yarn && popd

app: app-deps
	pushd app && yarn build && popd

app-prod: app-deps
	pushd app && yarn dist && popd

app-clean:
	rm -rf ./app/build

app-clean-prod:
	rm -rf ./app/build/min

server-deps:
	cd server && go get

server: server-deps
	cd server && GOARCH=amd64 && GOOS=linux go build

server-prod: server-deps
	cd server && GOARCH=amd64 && GOOS=linux go build -o ./server-linux

deps: app-deps server-deps

dist-clean:
	rm -rf ./dist

dist: app-clean-prod dist-clean app-prod server-prod
	mkdir -p ./dist
	mkdir -p ./dist/service
	mkdir -p ./dist/var
	cp -r app/build/min/assets ./dist/service/
	mv server/server-linux ./dist/service/server
	cp -r server/server-prod.yml ./dist/var/server-example.yml
	tar -czf website.tgz ./dist
