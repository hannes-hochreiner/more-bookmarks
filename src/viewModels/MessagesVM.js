export class MessagesVM {
  constructor(ps, uuid) {
    this._ps = ps;
    this._uuid = uuid;
    this._messages = [];
    this._show = false;
    this._text = '';
    this._type = '';
    this._timeout = 0;

    this._ps.subscribe({type: 'broadcast', action: 'userMessage'}, function(data) {
      let msg = data.message;

      msg.timeout = 3000;

      if (msg.type == 'error') {
        msg.timeout = 0;
      }

      this._messages.push(msg);
      this.nextMessage();
    }.bind(this));

    this.nextMessage = this.nextMessage.bind(this);
  }

  get text() {
    return this._text;
  }

  get type() {
    return this._type;
  }

  get show() {
    return this._show;
  }

  set show(value) {
    this._show = value;

    this.nextMessage();
  }

  get timeout() {
    return this._timeout;
  }

  nextMessage() {
    if (this._messages.length == 0) {
      return;
    }

    let msg = this._messages.shift();

    this._text = msg.text;
    this._timeout = msg.timeout;
    this._type = msg.type;
    // allow some time for rendering, before changing the property again
    setTimeout(function() {
      this._show = true;
    }.bind(this), 500);
  }
}