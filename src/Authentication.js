export class Authentication {
  constructor(ps, auth) {
    this._ps = ps;
    this._auth = auth;
    this._ps.subscribe({type: 'request', action: 'login'}, this._login.bind(this));
    // // this._ps.subscribe({type: 'request', action: 'logout'}, this._logout.bind(this));
    this._ps.subscribe({type: 'request', action: 'isAuthenticated'}, this._isAuthenticated.bind(this));

    this._ps.publish({type: 'broadcast', action: 'authenticationReady'});
  }

  async _isAuthenticated(req) {
    req.type = 'response';

    try {
      await this._auth.currentAuthenticatedUser();
      req.result = true;
    } catch (error) {
      req.result = false;
    }

    this._ps.publish(req);
  }

  async _login(req) {
    req.type = 'response';

    try {
      let user = await this._auth.signIn(req.userName, req.password);
  
      if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
        let res = await this._ps.oneshot({type: 'request', action: 'getNewPassword'});
        user = await this._auth.completeNewPassword(user, res.newPassword);
      }

      req.result = 'ok';
    } catch (error) {
      req.error = error;
    }

    this._ps.publish(req);
  }
}
