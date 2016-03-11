![icon](https://raw.githubusercontent.com/sndrs/Inbox/master/app/icon.png)

Desktop app for [Inbox by Gmail](https://inbox.google.com) that adds OS integration:

- new mail notifications
- unread count in the dock

![badge example](https://raw.githubusercontent.com/sndrs/Inbox/master/badge-example.png)

It's still in development, but it should be stable enough (I use it everyday).

## Installation

<a href="https://github.com/sndrs/Inbox/releases/latest">Download Inbox for OS X</a>.

To build for OS X, clone the repo, then:

`make install`

`make bundle`

For Windows or Linux, you'll need to build it yourself.

That should be pretty easy though – take a look at the build options for [electron-packager](https://www.npmjs.com/package/electron-packager) (and then maybe submit a little PR if you get it working nicely :wink:)

## Development

It's built using [Electron](http://electron.atom.io).

`make` will create a temporary Electron app in dev.

## Acknowledgements

The icon is by [jasonzigrino](http://jasonzigrino.deviantart.com/art/Google-Inbox-For-OS-X-515254018) and used under a [Creative Commons Attribution-Noncommercial-No Derivative Works 3.0 License](http://creativecommons.org/licenses/by-nc-nd/3.0/).

