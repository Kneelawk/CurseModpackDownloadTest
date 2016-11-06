const {
  BrowserWindow,
  app,
  ipcMain
} = require("electron");

const {
  Curse
} = require("./app/curse");

let loginWin;
let appWin;
let curse = new Curse();

function openLogin() {
  loginWin = new BrowserWindow({
    width: 300,
    height: 200
  });
  loginWin.loadURL(`file://${__dirname}/app/web/login.html`);
  loginWin.setMenu(null);
  loginWin.on('closed', () => {
    loginWin = null;
  });
}

function openAppWindow() {
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

app.on('ready', openLogin);

app.on('all-window-closed', () => {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('activated', () => {
  if (!curse.isLoggedIn() && loginWin === null) {
    openLogin();
  } else if (appWin === null) {
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
      event.sender.send('curse-login-failure');
    })
});

// handle login continue to application
ipcMain.on('login-finish', (event, arg) => {
  openAppWindow();
  loginWin.close();
});
