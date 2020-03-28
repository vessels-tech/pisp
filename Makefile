#
# TZ Voice Book
#

PATH := ./pisp/node_modules/.bin:$(PATH)
SHELL := /bin/bash

PROJECT = "demo-dfsp"
dir = $(shell pwd)
# $(shell touch env/.compiled; touch .tz_config)
# include ./config/version
# include .tz_config
# include $(dir)/env/.compiled

# admin_dir := $(dir)/src/admin
# env_dir := $(dir)/env

# PATH := $(dir)/node_modules/.bin:$(PATH)
# PATH := $(admin_dir)/node_modules/.bin:$(PATH)

# number ?= ${VB_test_mobile}

##
# Env Setup
# disabled for now... no real need
## 
# env:
# 	cat ${env_dir}/.env.${stage}.sh ${env_dir}/env.${stage}.sh > ${env_dir}/.compiled
# 	cat ${env_dir}/.compiled | sed s/"export "//g > ${env_dir}/.compiled.env

# switch:
# 	@echo switching to stage: ${stage}
# 	@echo 'export stage=${stage}\n' > .tz_config
# 	@make env
# 	# Set up the public site envs
# 	cp ./public/config.${stage}.js ./public/config.js 

# switch-local:
# 	make switch stage="local"

# switch-unit-test:
# 	touch env/.compiled
# 	mv env/dotenv.unittest.sh env/.env.development.sh
# 	make switch stage="development"

# switch-dev:
# 	make switch stage="development"

# switch-prod:
# 	make switch stage="production"

##
# Local Development
##
build:
	cd ./pisp-server && npm run build

# lint: 
	# yarn run lint

# run-lt: 
	# @lt --subdomain ${LT_SUBDOMAIN} --port 3000

watch:
	cd ./pisp-server && npm run watch


run-dev:
	cd ./pisp-server && npm run dev

run-db:
	# only run the database not the server 
	docker-compose -f docker-compose.local.yml up -d db 

run-docker:
	source ./env/.compiled; docker-compose -f docker-compose.local.yml up vb-server

get-timestamp:
	@timestamp=`date +%Y%m%d%H%M%S` \
		&& echo Timestamp copied to clipboard \
		&& echo $timestamp | pbcopy

create-seed:
	@cp scripts/example.seed.ts seeds/`date +%Y%m%d%H%M%S`_seed.ts

create-migration:
	@cp scripts/example.migration.ts migrations/`date +%Y%m%d%H%M%S`_migration.ts

##
# Tests
##
test-unit-coverage:
	source ./env/.compiled; npm run coverage:unit -- --exit

test-unit:
	source ./env/.compiled; npm run test:unit -- --exit

test-unit-no-tsnode:
	source ./env/.compiled; npm run test:unit-no-tsnode -- --exit

test-unit-watch:
	nodemon --exec make test-unit --ext "ts"

# @kevin forgive my laziness here. I wanted a way to run `make watch` in one shell, and `make test-unit-watch` in the other without waiting for ts-node to compile
# so I added this hacky method
test-unit-watch-no-tsnode:
	nodemon --exec make test-unit-no-tsnode --ext "ts"

test-service:
	source ./env/.compiled; npm run test:service -- --exit

test-api:
	@make admin-health-check
	source ./env/.compiled; npm run test:api -- --exit

##
# Deployment
##
docker-build:
	docker build . -t vesselstech/voicebook:latest

docker-push:
	docker push vesselstech/voicebook:latest

deploy:
	@make env build test-unit
	#TODO: figure out how to run service tests here... if we are non-local, the tests will run against a live database
	@./scripts/_deploy.sh

deploy-env:
	@make env
	@./scripts/_update_env.sh

.PHONY: switch switch-dev swich-prod env