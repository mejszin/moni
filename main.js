// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const updateInterval = 1000 * 60;
var appClosed = false

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      webSecurity: false
    }
  })

  // Load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  // Set flag on close
  mainWindow.on('closed', function () {
    appClosed = true;
  });
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('start-updater', function (event, arg) {
  const testFolder = './reports/';
  const fs = require('fs');

  var renderer = event.sender;
  iterateReports(renderer);
  setInterval(function() { if (!appClosed) {
      iterateReports(renderer)
    }
  }, updateInterval);
});

function iterateReports(sender) {
  const testFolder = './reports/';
  const fs = require('fs');
  sender.send('clear-body')
  
  
  fs.readdir(testFolder, (err, files) => {
    files.forEach(file => {
      sender.send('add-indicator', file)
    });
  });
}