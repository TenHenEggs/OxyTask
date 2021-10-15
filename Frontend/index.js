const {app, BrowserWindow} = require('electron');
const url = require('url');
const path = require('path');

let window;

function createWindow(){
    window = new BrowserWindow(
        {
            width: 1280, 
            height: 720,
            title: 'OxyTask'
        }
    );
    window.loadURL(
        url.format(
            {
                pathname: path.join(__dirname, 'index.html'),
                protocol: 'file:',
                slashes: true
            }
        )
    );
}

app.on('ready', createWindow);