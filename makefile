default:
	@electron-packager ./app "Inbox" \
		--platform=darwin \
		--arch=all \
		--version=0.33.6 \
		--icon=./icon.icns \
		--overwrite \
		--asar=true \
		&& open Inbox-darwin-x64/Inbox.app