'use strict';

const snapDet     = require('clap-detector');
const spawn       = require('child_process').spawn;
const electron    = require('electron');
const PowerState  = require('./power_state');

const app           = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain       = electron.ipcMain;

var mainWindow, stayAlive = false;

/******************************** Mouse Mover *********************************/

const mouse = spawn('./mouse');
mouse.stdin.setEncoding('utf-8');

mouse.stderr.on('data', (data) => {
  console.error('Error in mouse mover:', data);
});

/************************************ App *************************************/

// Get screen size
var scr_width;
var scr_height;

var initialize = function () {
  stayAlive = false;

  const scr_size = electron.screen.getPrimaryDisplay().workAreaSize;
  scr_width  = scr_size.width;
  scr_height = scr_size.height;

  // const this_width  = 150;
  // const this_height = 113;
  const this_width  = 150;
  const this_height = 112;

  mainWindow = new BrowserWindow({
    width: this_width,
    height: this_height,
    x: scr_width - this_width - 20,
    y: scr_height - this_height - 0,
    alwaysOnTop: true,
    resizable: false,
    titleBarStyle: 'hidden'
  });
  mainWindow.loadURL('file://' + __dirname + '/html/index.html');
}

app.on('ready', initialize);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (!stayAlive) app.quit();
});

// Quit child process before quitting
app.on('before-quit', function () {
  mouse.kill();
  // Can't kill directly because sudo
  dash.stdin.write('die\n');
});

ipcMain.on('position', (event, x, y) => {
  mouse.stdin.write(Math.floor(scr_width * x) + ',' + Math.floor(scr_height * y) + '\n');
});

/******************************** Sound Clicks ********************************/

var snap_config = {
  MAX_HISTORY_LENGTH: 1
};

snapDet.start(snap_config);

snapDet.onClap(function () {
  mouse.stdin.write('d\n');
  mouse.stdin.write('u\n');
});

/***************************** Dash Button Clicks *****************************/

const dash = spawn('sudo', ['node', 'dash_server.js']);
const p    = new PowerState('ajaj');

dash.stdin.setEncoding('utf-8');
dash.stdout.on('data', (data) => {
  p.state(function (s) {
    // Asleep, wake up
    if (s == 1) {
      p.unlock();

    } else {
      // Toggle
      if (mainWindow == null) {
        initialize();
      } else {
        stayAlive = true;
        mainWindow.close();
        mainWindow = null;
      }
    }
  });
});
