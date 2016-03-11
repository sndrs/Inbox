'use strict';

const ipc = require('electron').ipcMain;
const app = require('electron').app;  // Module to control application life.
const BrowserWindow = require('electron').BrowserWindow;  // Module to create native browser window.

const path = require('path');
const fs = require('fs');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null, focussed = true, unreadMail = [];

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

    mainWindow = new BrowserWindow(Object.assign({
        'min-width': 620,
        'title-bar-style': 'hidden',
        show: false
    }, bounds));

    // mainWindow.openDevTools();

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.show();
    });

    mainWindow.loadURL(`file://${__dirname}/index.html`);

    mainWindow.on('close', () => {
        fs.writeFileSync(initPath, JSON.stringify(mainWindow.getBounds()));
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    mainWindow.on('focus', () => {
        focussed = true;
    });

    mainWindow.on('blur', () => {
        focussed = false;
    })
});

ipc.on('MAIL_STATUS', (e, data) => {
    console.log('mail status changed', data.count);
    app.dock.setBadge(data.count > 0 ? data.count : '');

    !focussed && data.mail.filter((mail => !unreadMail.some((_mail) => _mail.id === mail.id))).forEach((newMail) => {
        mainWindow.webContents.send('NOTIFY', {
            title: newMail.subject,
            body: newMail.sender,
            silent: true
        });
    });
    unreadMail = data.mail;
});
