const {
  ipcRenderer
} = require('electron');
const $ = require('./jquery/jquery-3.1.1.min.js');

let loggingIn = false;

$(() => {
  // login stuff
  $('[name=curse-login-button]').click(() => {
    startLogin();
  });
  $('[name=password]').keypress((e) => {
    if (e.which == 13) {
      startLogin();
    }
  });

  // continue stuff
  $('[name=login-finish]').click(() => {
    ipcRenderer.send('login-finish');
    $('#login').hide();
  });
});

function startLogin() {
  if (!loggingIn) {
    loggingIn = true;
    setLoginButtonDisabled(true);
    let username = $('[name=username]').val();
    let password = $('[name=password]').val();
    ipcRenderer.once('curse-login-success', (event) => {
      $('#curse-login-result').text('Login Success');
      loggingIn = false;
      setLoginButtonDisabled(false);
      $('[name=login-finish]').prop('disabled', false);
    });
    ipcRenderer.once('curse-login-failure', (event, result) => {
      $('#curse-login-result').text('Login Failure: ' + result);
      loggingIn = false;
      setLoginButtonDisabled(false);
    });
    ipcRenderer.send('curse-login', {
      username,
      password
    });
  }
}

function setLoginButtonDisabled(disabled) {
  $('[name=curse-login-button]').prop('disabled', disabled);
}
