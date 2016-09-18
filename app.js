
const spawn    = require('child_process').spawn;
const electron = require('electron');

const app           = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain       = electron.ipcMain;

var mainWindow;

/******************************** Mouse Mover *********************************/

// Initialize mouse mover
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
  mainWindow = new BrowserWindow({ width: 800, height: 600 });
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
});

// Send updates to cursor
ipcMain.on('delta', (event, dx, dy) => {
  mouse.stdin.write((dx * -500) + ',' + (dy * 500) + '\n');
});
