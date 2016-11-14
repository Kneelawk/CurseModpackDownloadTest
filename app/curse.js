const {
  Client
} = require("node-rest-client");
const Callback = require("events");

const apiBase = "https://curse-rest-proxy.azurewebsites.net/api";
const apiAuth = `${apiBase}/authenticate`;
const apiGetAddon = apiBase + "/addon/${projectId}";
const apiGetAddonFiles = apiBase + "/addon/${projectId}/files";
const apiGetFile = apiBase + "/addon/${projectId}/file/${fileId}";

class LoginCallback extends Callback {}
class GetInformationCallback extends Callback {}

class Curse {
  constructor() {
    this.client = new Client();
  }

  constructor(token) {
    this.token = token;
    this.client = new Client();
  }

  login(username, password) {
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

  isLoggedIn() {
    return !!this.token;
  }

  getProject(projectId) {
    if (!this.token) {
      throw new Error("The curse api has not been authenticated");
    }

    let args = {
      path: {
        projectId
      },
      headers: {
        "Authentication": this.token
      }
    };

    let callback = new GetInformationCallback();

    this.client.get(apiGetAddon, args, (data, response) => {
      if (Math.floor(response.statusCode / 100) == 2) {
        callback.emit('finish', {
          data
        });
      } else {
        callback.emit('error', {
          response
        });
      }
    });

    return callback;
  }

  getProjectFiles(projectId) {
    if (!this.token) {
      throw new Error("The curse api has not been authenticated");
    }

    let args = {
      path: {
        projectId
      },
      headers: {
        "Authentication": this.token
      }
    };

    let callback = new GetInformationCallback();

    this.client.get(apiGetAddonFiles, args, (data, response) => {
      if (Math.floor(resonse.statusCode / 100) == 2) {
        callback.emit('finish', {
          data
        });
      } else {
        callback.emit('error', {
          response
        });
      }
    });

    return callback;
  }

  getFile(projectId, fileId) {
    if (!this.token) {
      throw new Error("The curse api has not been authenticatd");
    }

    let args = {
      path: {
        projectId,
        fileId
      },
      headers: {
        "Authentication": this.token
      }
    };

    let callback = new GetInformationCallback();

    this.client.get(apiGetFile, args, (data, response) => {
      if (Math.floor(response.statusCode / 100) == 2) {
        callback.emit('finish', {
          data
        });
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
