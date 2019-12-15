export class Repository {
  constructor() {
    this._dispatchArray = [
      {type: 'request', action: 'treesByUserId', fun: this._treesByUserId.bind(this)},
      {type: 'request', action: 'bookmarksByIds', fun: this._bookmarksByIds.bind(this)}
    ];
    this._trees = [
      {_id: '/trees/1', sharedWith: ['1'], id: '1', name: 'tree 1'},
      {_id: '/trees/2', sharedWith: ['2'], id: '2', name: 'tree 2'},
      {_id: '/trees/3', sharedWith: ['1', '2'], id: '3', name: 'tree 3'}
    ];
    this._bc = new BroadcastChannel('net.hochreiner.more-bookmarks');
    this._bc.onmessage = this._dispatch.bind(this);
    this._bc.postMessage({type: 'broadcast', action: 'repositoryReady'});
  }

  _dispatch(event) {
    let ev = event.data;
    let disp = this._dispatchArray.find(elem => ev.type == elem.type && ev.action == elem.action);

    if (disp) {
      disp.fun(ev);
    }
  }

  _treesByUserId(req) {
    this._bc.postMessage({
      type: 'response',
      action: req.action,
      userId: req.userId,
      result: this._trees.filter(elem => elem.sharedWith.includes(req.userId))
    });
  }

  _bookmarksByIds(req) {
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
