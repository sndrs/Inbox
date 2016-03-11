'use strict';

const ipc = require('electron').ipcMain;
const app = require('electron').app;  // Module to control application life.
const BrowserWindow = require('electron').BrowserWindow;  // Module to create native browser window.

const path = require('path');
const fs = require('fs');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null, unreadMail = [];

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    app.quit();
});

app.on('ready', function() {
    const initPath = path.join(app.getPath('appData'), "init.json");
    let bounds = {};

    try {
        bounds = JSON.parse(fs.readFileSync(initPath, 'utf8'));
    } catch (e) {};

    // merge defaults with any saved window data
    mainWindow = new BrowserWindow(Object.assign({
        minWidth: 620,
        titleBarStyle: 'hidden',
        show: false
    }, bounds));

    // mainWindow.openDevTools();

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.show();
    });

    mainWindow.loadURL(`file://${__dirname}/index.html`);

    // remember window position and dimensions on close
    mainWindow.on('close', () => {
        fs.writeFileSync(initPath, JSON.stringify(mainWindow.getBounds()));
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});

ipc.on('MAIL_STATUS', (e, data) => {
    app.dock.setBadge(data.count > 0 ? data.count : '');

    // send a notification if the window is not focussed
    mainWindow.isFocused() || data.mail.filter((mail => !unreadMail.some((_mail) => _mail.id === mail.id))).forEach((newMail) => {
        mainWindow.webContents.send('NOTIFY', {
            title: newMail.subject,
            body: newMail.sender,
            silent: true
        });
    });
    unreadMail = data.mail;
});
