const {
  BrowserWindow,
  app,
  ipcMain
} = require("electron");

const {
  Curse
} = require("./app/curse.js");

let appWin;
let curse = new Curse();

function openWindow() {
  appWin = new BrowserWindow({
    width: 1000,
    height: 600
  });
  appWin.loadURL(`file://${__dirname}/app/web/index.html`);
  appWin.setMenu(null);
  appWin.on('closed', () => {
    appWin = null;
  });
}

app.on('ready', openWindow);

app.on('all-window-closed', () => {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('activated', () => {
  if (appWin === null) {
    openAppWindow();
  }
});

// handle login stuff
ipcMain.on('curse-login', (event, data) => {
  curse.login(data.username, data.password)
    .on('login', () => {
      event.sender.send('curse-login-success');
    })
    .on('error', (result) => {
      let message;
      if (result.response) {
        message = 'Status ' + result.response.statusCode + ' ' + result.response.statusMessage;
      } else if (result.data) {
        message = result.data.message;
      }
      event.sender.send('curse-login-failure', message);
    })
});

// handle login continue to application
ipcMain.on('login-finish', (event, arg) => {});
