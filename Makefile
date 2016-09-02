# SHELL = /bin/csh
.PHONY: server test help build
.DEFAULT_GOAL := help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

help_unsort:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

lint:
	./node_modules/.bin/eslint src

preversion:
	make lint

version:
	make stats && make build && git add -A .

postversion:
	git push --tags

stats:
	NODE_ENV=production ./node_modules/.bin/webpack --profile --json --config config/webpack.config.prod.js > static/stats.json

gh:
	git subtree push --prefix build origin gh-pages

dev:
	node ./scripts/start.js

build:
	node ./scripts/build.js

server:
	./node_modules/.bin/nodemon server/index.js --exec ./node_modules/.bin/babel-node

test:
	compile && ./node_modules/.bin/mocha dist/**/*.js --compilers js:babel-core/register --opts ./mocha.opts --recursive --reporter spec

selenium:
	selenium-standalone start

chromedriver:
	 ./~/Desktop/development/chromedriver --url-base=wd/hub --port=4444

e2e_run:
	wdio wdio.conf.js

push:
	git push -u laddice-development-graph dependency_tree:master