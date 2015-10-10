default:
	@./node_modules/.bin/electron ./app

install:
	@npm i && npm prune
	@cd app && npm i && npm prune

bundle:
	@./node_modules/.bin/electron-packager ./app "Inbox" \
		--platform=darwin \
		--arch=all \
		--version=0.33.7 \
		--icon=./icon.icns \
		--overwrite \
		--asar=true \
		&& open Inbox-darwin-x64/Inbox.app