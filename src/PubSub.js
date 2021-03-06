export class PubSub {
  constructor(channel, uuid) {
    this._uuid = uuid;
    this._subs = {};
    this._bc = new BroadcastChannel(channel);
    this._bc.onmessage = this._dispatch.bind(this);
  }

  _dispatch(event) {
    let data = event.data;

    for (let key in this._subs) {
      if (this._subs.hasOwnProperty(key) && PubSub._testObjectHasKeysValues(data, this._subs[key].filter)) {
        this._subs[key].fun(data);
      }
    }
  }

  static _testObjectHasKeysValues(obj, filter) {
    for (let key in filter) {
      if (filter.hasOwnProperty(key)) {
        if (obj[key] !== filter[key]) {
          return false;
        }
      }
    }

    return true;
  }

  subscribe(filter, fun) {
    let token = this._uuid();

    this._subs[token] = {filter: filter, fun: fun};
    return token;
  }

  unsubscribe(token) {
    delete this._subs[token];
  }

  oneshot(obj) {
    return new Promise(function(resolve, reject) {
      let id = this._uuid();
      let token = this.subscribe({type: 'response', id: id, action: obj.action}, function(res) {
        this.unsubscribe(token);

        if (res.error) {
          reject(res);
        } else {
          resolve(res);
        }
      }.bind(this));

      obj.id = id;
      obj.type = 'request';
      this.publish(obj);
    }.bind(this));
  }

  publish(obj) {
    this._bc.postMessage(obj);
  }
}

export class PubSubFactory {
  constructor(channel, uuid) {
    this._channel = channel;
    this._uuid = uuid;
  }

  createInstance() {
    return new PubSub(this._channel, this._uuid);
  }
}
