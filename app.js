'use strict';

const snapDet     = require('clap-detector');
const spawn       = require('child_process').spawn;
const electron    = require('electron');

const app           = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain       = electron.ipcMain;

var mainWindow;

/******************************** Mouse Mover *********************************/

const mouse = spawn('./mouse');
mouse.stdin.setEncoding('utf-8');

mouse.stderr.on('data', (data) => {
  console.error('Error in mouse mover:', data);
});

mouse.on('close', (code) => {
  console.log('Mouse mover exited with code:', code);
});

/************************************ App *************************************/

app.on('ready', function () {
  mainWindow = new BrowserWindow({
    width: 142,
    height: 132,
    alwaysOnTop: true,
    resizable: false
  });
  mainWindow.loadURL('file://' + __dirname + '/html/index.html');
  mainWindow.webContents.openDevTools();
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  app.quit();
});

// Quit child process before quitting
app.on('before-quit', function () {
  mouse.kill('SIGINT');
  dash.kill('SIGINT');
});

ipcMain.on('delta', (event, dx, dy) => {
  mouse.stdin.write(dx + ',' + dy + '\n');
});

/******************************** Sound Clicks ********************************/

var snap_config = {
  MAX_HISTORY_LENGTH: 1
};

snapDet.start(snap_config);

snapDet.onClap(function() {
  mouse.stdin.write('d\n');
  mouse.stdin.write('u\n');
});

/***************************** Dash Button Clicks *****************************/

const dash = spawn('sudo', ['node', 'dash_server.js']);

dash.stdout.on('data', (data) => {
  mouse.stdin.write('d\n');
  mouse.stdin.write('u\n');
});

dash.on('close', (code) => {
  console.log('Dash button exited with code:', code);
});
