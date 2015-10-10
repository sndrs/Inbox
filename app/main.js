'use babel';

import app from 'app';
import ipc from 'ipc';
import BrowserWindow from 'browser-window';
import path from "path";
import fs from "fs";

require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null, badgeable = false;

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    app.quit();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
    const initPath = path.join(app.getDataPath(), "init.json");
    let bounds = {};
    try {
        bounds = JSON.parse(fs.readFileSync(initPath, 'utf8'));
    } catch (e) {};

    mainWindow = new BrowserWindow(Object.assign({
        'min-width': 620,
        'title-bar-style': 'hidden',
        show: false
    }, bounds));

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.show();
    });

    mainWindow.loadUrl(`file://${__dirname}/index.html`);

    mainWindow.on('close', () => {
        fs.writeFileSync(initPath, JSON.stringify(mainWindow.getBounds()));
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    mainWindow.on('focus', () => {
        setTimeout(() => {
            app.dock.setBadge('');
            badgeable = false;
        }, 1000);
    });

    mainWindow.on('blur', () => {
        badgeable = true;
    })
});

ipc.on('newMail', (e, details) => {
    if (badgeable) {
        app.dock.setBadge('•');
        mainWindow.webContents.send('newMail', details);
    }
});