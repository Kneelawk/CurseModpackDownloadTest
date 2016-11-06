const {
  BrowserWindow,
  app,
  ipcMain
} = require("electron");

const {
  Curse
} = require("./app/curse");

let win;

function openWindow() {
  win = new BrowserWindow({
    width: 300,
    height: 200
  });
  win.loadURL(`file://${__dirname}/app/web/login.html`);
  win.setMenu(null);
  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', openWindow);

app.on('all-window-closed', () => {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('activated', () => {
  if (win === null) {
    openWindow();
  }
});
