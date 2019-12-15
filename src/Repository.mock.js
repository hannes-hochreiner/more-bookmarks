export class Repository {
  constructor(pubsub) {
    this._trees = [
      {_id: '/trees/1', default: false, sharedWith: ['1'], id: '1', name: 'tree 1', groupIds: ['2', '3'], bookmarkIds: ['2', '1']},
      {_id: '/trees/2', default: false, sharedWith: ['2'], id: '2', name: 'tree 2', groupIds: [], bookmarkIds: []},
      {_id: '/trees/3', default: true, sharedWith: ['1', '2'], id: '3', name: 'tree 3', groupIds: ['1'], bookmarkIds: []}
    ];
    this._groups = [
      {_id: '/groups/3/1', name: 'group 1', id: '1', treeId: '3', groupIds: ['4'], bookmarkIds: ['3']},
      {_id: '/groups/1/2', name: 'group 2', id: '2', treeId: '1', groupIds: [], bookmarkIds: []},
      {_id: '/groups/1/3', name: 'group 3', id: '3', treeId: '1', groupIds: [], bookmarkIds: []},
      {_id: '/groups/3/4', name: 'group 4', id: '4', treeId: '3', groupIds: [], bookmarkIds: ['5', '4']}
    ];
    this._bookmarks = [
      {_id: '/bookmarks/1/1', id: '1', treeId: '1', name: 'bm 1', url: 'http://hochreiner.net'},
      {_id: '/bookmarks/1/2', id: '2', treeId: '1', name: 'bm 2', url: 'http://hochreiner.net'},
      {_id: '/bookmarks/3/3', id: '3', treeId: '3', name: 'bm 3', url: 'http://hochreiner.net'},
      {_id: '/bookmarks/3/4', id: '4', treeId: '3', name: 'bm 4', url: 'http://hochreiner.net'},
      {_id: '/bookmarks/3/5', id: '5', treeId: '3', name: 'bm 5', url: 'http://hochreiner.net'}
    ];
    this._ps = pubsub;
    this._ps.subscribe({type: 'request', action: 'treesByUserId'}, this._treesByUserId.bind(this));
    this._ps.subscribe({type: 'request', action: 'bookmarksByIds'}, this._bookmarksByIds.bind(this));
    this._ps.subscribe({type: 'request', action: 'groupsByIds'}, this._groupsByIds.bind(this));
    this._ps.publish({type: 'broadcast', action: 'repositoryReady'});
  }

  _treesByUserId(req) {
    this._ps.publish({
      type: 'response',
      action: req.action,
      userId: req.userId,
      result: this._trees.filter(elem => elem.sharedWith.includes(req.userId))
    });
  }

  _bookmarksByIds(req) {
    let filter = req.bookmarkIds.map(function(elem) {
      return `/bookmarks/${req.treeId}/${elem}`;
    });

    this._ps.publish({
      type: 'response',
      action: 'bookmarksByIds',
      treeId: req.treeId,
      bookmarkIds: req.bookmarkIds,
      result : this._bookmarks.filter(bm => filter.includes(bm._id))
    });
  }

  _groupsByIds(req) {
    let filter = req.groupIds.map(function(elem) {
      return `/groups/${req.treeId}/${elem}`;
    });

    this._ps.publish({
      type: 'response',
      action: 'groupsByIds',
      treeId: req.treeId,
      bookmarkIds: req.groupIds,
      result : this._groups.filter(grp => filter.includes(grp._id))
    });
  }
}
