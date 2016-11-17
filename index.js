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
  appWin.webContents.openDevTools();
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
  console.log('Logging in...');
  curse.login(data.username, data.password)
    .on('login', (login) => {
      console.log('Logged in as: ' + login.username);
      event.sender.send('curse-login-success', login.username);
    })
    .on('error', (result) => {
      let message;
      if (result.response) {
        if (result.response.statusCode == 401) {
          message = 'Bad username or password.';
        } else {
          message = 'Status ' + result.response.statusCode + ' ' + result.response.statusMessage;
        }
      } else if (result.data) {
        message = result.data.message;
      }
      console.log('Login Failure: ' + message);
      event.sender.send('curse-login-failure', message);
    })
});

// handle login continue to application
ipcMain.on('login-finish', (event, arg) => {});
