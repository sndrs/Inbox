default:
	@./node_modules/.bin/electron ./src

bundle:
	@./node_modules/.bin/electron-packager ./src "Inbox" \
		--platform=darwin \
		--arch=all \
		--icon=./icon.icns \
		--overwrite \
		--asar=true \
		&& open Inbox-darwin-x64/Inbox.app