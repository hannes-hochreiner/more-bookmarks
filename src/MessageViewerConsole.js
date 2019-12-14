export class MessageViewerConsole {
  constructor() {
    this._bc = new BroadcastChannel('net.hochreiner.more-bookmarks');
    this._bc.onmessage = function(event) {
      console.log(event);
    };
  }
}
