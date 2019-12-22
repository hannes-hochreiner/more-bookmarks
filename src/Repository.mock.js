export class Repository {
  constructor(pubsub) {
    this._trees = [
      {_id: '/tree/1', _rev: 1, type: 'tree', default: false, sharedWith: ['1'], id: '1', name: 'tree 1', groupIds: ['2', '3'], bookmarkIds: ['2', '1']},
      {_id: '/tree/2', _rev: 1, type: 'tree', default: false, sharedWith: ['2'], id: '2', name: 'tree 2', groupIds: [], bookmarkIds: []},
      {_id: '/tree/3', _rev: 1, type: 'tree', default: true, sharedWith: ['1', '2'], id: '3', name: 'tree 3', groupIds: ['1'], bookmarkIds: []}
    ];
    this._groups = [
      {_id: '/group/3/1', _rev: 1, type: 'group', name: 'group 1', id: '1', treeId: '3', groupIds: ['4'], bookmarkIds: ['3']},
      {_id: '/group/1/2', _rev: 1, type: 'group', name: 'group 2', id: '2', treeId: '1', groupIds: [], bookmarkIds: []},
      {_id: '/group/1/3', _rev: 1, type: 'group', name: 'group 3', id: '3', treeId: '1', groupIds: [], bookmarkIds: []},
      {_id: '/group/3/4', _rev: 1, type: 'group', name: 'group 4', id: '4', treeId: '3', groupIds: [], bookmarkIds: ['5', '4']}
    ];
    this._bookmarks = [
      {_id: '/bookmark/1/1', _rev: 1, type: 'bookmark', id: '1', treeId: '1', name: 'bm 1', url: 'http://hochreiner.net'},
      {_id: '/bookmark/1/2', _rev: 1, type: 'bookmark', id: '2', treeId: '1', name: 'bm 2', url: 'http://hochreiner.net'},
      {_id: '/bookmark/3/3', _rev: 1, type: 'bookmark', id: '3', treeId: '3', name: 'bm 3', url: 'http://hochreiner.net'},
      {_id: '/bookmark/3/4', _rev: 1, type: 'bookmark', id: '4', treeId: '3', name: 'bm 4', url: 'http://hochreiner.net'},
      {_id: '/bookmark/3/5', _rev: 1, type: 'bookmark', id: '5', treeId: '3', name: 'bm 5', url: 'http://hochreiner.net'}
    ];
    this._ps = pubsub;
    this._ps.subscribe({type: 'request', action: 'treesByUserId'}, this._treesByUserId.bind(this));
    this._ps.subscribe({type: 'request', action: 'bookmarksByIds'}, this._bookmarksByIds.bind(this));
    this._ps.subscribe({type: 'request', action: 'groupsByIds'}, this._groupsByIds.bind(this));
    this._ps.subscribe({type: 'request', action: 'persistObjects'}, this._persistObjects.bind(this));
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
      return `/bookmark/${req.treeId}/${elem}`;
    });

    this._ps.publish({
      type: 'response',
      action: 'bookmarksByIds',
      treeId: req.treeId,
      bookmarkIds: req.bookmarkIds,
      result : this._sortedFilter(this._bookmarks, filter)
    });
  }

  _groupsByIds(req) {
    let filter = req.groupIds.map(function(elem) {
      return `/group/${req.treeId}/${elem}`;
    });

    this._ps.publish({
      type: 'response',
      action: 'groupsByIds',
      treeId: req.treeId,
      bookmarkIds: req.groupIds,
      result : this._sortedFilter(this._groups, filter)
    });
  }

  _persistObjects(req) {
    for (let idx in req.objects) {
      let obj = req.objects[idx];
      let container = this[`_${obj.type}s`];

      if (!obj._id) {
        obj._rev = 1;
        obj._id = `/${obj.type}/${obj.id}`;

        container.push(obj);
      } else {
        obj._rev++;
        container.splice(this._trees.findIndex(elem => elem.id == obj.id), 1, obj);
      }
    }

    req.type = 'response';
    this._ps.publish(req);
  }

  _sortedFilter(objArray, filterArray) {
    let res = [];

    for (let filterIdx in filterArray) {
      res.push(objArray.find(elem => elem._id == filterArray[filterIdx]));
    }

    return res;
  }
}
