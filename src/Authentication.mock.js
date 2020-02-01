export class Authentication {
  constructor(ps) {
    this._ps = ps;
    this._loggedIn = false;

    this._ps.subscribe({type: 'request', action: 'login'}, this._login.bind(this));
    this._ps.subscribe({type: 'request', action: 'logout'}, this._logout.bind(this));
    this._ps.subscribe({type: 'request', action: 'isAuthenticated'}, this._isAuthenticated.bind(this));
  }
  
  async _login(req) {
    req.type = 'response';

    if (req.userName == 'testName' && req.password == 'testWord') {
      await this._ps.oneshot({type: 'request', action: 'getNewPassword'});
      req.result = 'ok';
      this._loggedIn = true;
    } else {
      req.error = new Error('login failed');
    }

    this._ps.publish(req);
  }

  _logout(req) {
    req.type = 'response';
    req.result = 'ok';
    this._loggedIn = false;
    this._ps.publish(req);
  }

  _isAuthenticated(req) {
    req.type = 'response';
    req.result = this._loggedIn;
    this._ps.publish(req);
  }
}