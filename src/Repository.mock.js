export class Repository {
  constructor() {
    this._bc = new BroadcastChannel('net.hochreiner.more-bookmarks');
    this._bc.onmessage = this._dispatch.bind(this);
  }

  _dispatch(event) {
    if (event.data.action == 'bookmarksByUserId' && event.data.type == 'request') {
      this._getBookmarksByUserId(event.data);
    }
  }

  _getBookmarksByUserId(req) {
    this._bc.postMessage({
      type: 'response',
      action: 'bookmarksByUserId',
      id: req.id,
      userId: req.userId,
      result : [
        {_id: 'bookmarks/1', id: '1', url: 'http://hochreiner.net', name: 'hochreiner.net'},
        {_id: 'bookmarks/2', id: '2', url: 'http://heise.de', name: 'heise.de'},
        {_id: 'bookmarks/3', id: '3', url: 'http://zeit.de', name: 'zeit.de'}
      ]
    });
  }
}
