const {
  app,
  BrowserWindow
} = require('electron');
const url = require('url');
const path = require('path');

let window;

function createWindow() {
  window = new BrowserWindow({
    width: 1280,
    height: 720,
    title: 'OxyTask',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  window.loadURL(
    url.format({
      pathname: path.join(__dirname, 'menu', 'index.html'),
      protocol: 'file:',
      slashes: true,
    })
  );
}

app.on('ready', createWindow);
