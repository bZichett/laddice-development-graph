# SHELL = /bin/csh

.PHONY: help
.DEFAULT_GOAL := help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

help_unsort:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

#  --hot --inline
dev:
	node webpack/devServer.js --env.devServer

release_prod:
	node webpack/release.js --production --notes=${notes} --flag=production --type=${type}

release_pre:
	node webpack/release.js --production --notes=${notes} --flag=development --type=${type}

release_d:
	node webpack/release.js --development

webpack_p:
	./node_modules/webpack/bin/webpack.js -p --env.production --config webpack/webpack.config.js --progress

webpack_d:
	./node_modules/webpack/bin/webpack.js --env.staging --config webpack/webpack.config.js --progress

clean_build:
	node webpack/utils/clean.js

delete_version:
	node src/webpack/utils/deleteVersion.js

lint_spa:
	./node_modules/eslint/bin/eslint.js -c .eslintrc $(SPA_SOURCES)

lint_blog:
	./node_modules/eslint/bin/eslint.js $(BLOG_SOURCES)

selenium:
	selenium-standalone start

chromedriver:
	 ./~/Desktop/development/chromedriver --url-base=wd/hub --port=4444

e2e_run:
	wdio wdio.conf.js