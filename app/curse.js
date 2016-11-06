const {
  Client
} = require("node-rest-client");
const Callback = require("events");

const apiBase = "https://curse-rest-proxy.azurewebsites.net/api";
const apiAuth = `${apiBase}/authenticate`;

class LoginCallback extends Callback {}

class Curse {
  constructor() {
    this.client = new Client();
  }

  login(password, username) {
    let args = {
      data: {
        username,
        password
      },
      headers: {
        "Content-Type": "application/json"
      }
    };

    let callback = new LoginCallback();

    this.client.post(apiAuth, args, (data, response) => {
      if (Math.floor(response.statusCode / 100) == 2) {
        if (data.status == "Success") {
          this.token = "Token " + data.session.user_id + ":" + data.session.token;
          callback.emit('login', {
            token: this.token,
            username: data.session.username
          })
        } else {
          callback.emit('error', {
            data
          });
        }
      } else {
        callback.emit('error', {
          response
        });
      }
    });

    return callback;
  }
}

module.exports.Curse = Curse;
