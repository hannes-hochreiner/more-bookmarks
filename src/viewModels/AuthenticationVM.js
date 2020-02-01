export class AuthenticationVM {
  constructor(ps, uuid) {
    this._ps = ps;
    this._uuid = uuid;
    this._password = '';
    this._newPassword = '';
    this._userName = '';
    this._getNewPassword = false;
    this._newPasswordRequest = null;

    this.login = this.login.bind(this);
    this.setNewPassword = this.setNewPassword.bind(this);
    this._ps.subscribe({type: 'request', action: 'getNewPassword'}, this.startGettingNewPassword.bind(this));
  }

  startGettingNewPassword(req) {
    this._newPasswordRequest = req;
    this._getNewPassword = true;
  }

  setNewPassword() {
    let req = this._newPasswordRequest;

    this._getNewPassword = false;
    req.type = 'response';
    req.newPassword = this._newPassword;

    this._ps.publish(req);
  }

  get getNewPassword() {
    return this._getNewPassword;
  }

  set getNewPassword(value) {
    this._getNewPassword = value;
  }

  get userName() {
    return this._userName;
  }

  set userName(value) {
    this._userName = value;
  }

  get password() {
    return this._password;
  }

  set password(value) {
    this._password = value;
  }

  get newPassword() {
    return this._newPassword;
  }

  set newPassword(value) {
    this._newPassword =  value;
  }

  async login() {
    try {
      await this._ps.oneshot({
        type: 'request',
        action: 'login',
        userName: this._userName,
        password: this._password
      });
      this._ps.publish({
        type: 'broadcast',
        action: 'userMessage',
        message: {
          type: 'success',
          text: 'Authentication succeeded'
        }
      });
      this._ps.publish({
        type: 'broadcast',
        action: 'navigateTo',
        url: '/'
      });
    } catch (err) {
      console.log(err);

      this._ps.publish({
        type: 'broadcast',
        action: 'userMessage',
        message: {
          type: 'error',
          text: err.message || 'Authentication failed'
        }
      });
    }
  }
}
