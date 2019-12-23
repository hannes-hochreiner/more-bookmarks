export class BookmarksVM {
  constructor(ps, uuid, parameters) {
    this._ps = ps;
    this._uuid = uuid;

    this._ps.subscribe({type: 'response', action: 'bookmarksByIds'}, function(data) {
      this._bookmarks = data.result;
    }.bind(this));
    this._ps.subscribe({type: 'response', action: 'groupsByIds'}, function(data) {
      this._groups = data.result;
    }.bind(this));

    this.switchToReorderMode = this.switchToReorderMode.bind(this);
    this.ok = this.ok.bind(this);
    this.cancel = this.cancel.bind(this);
    this.moveGroupUp = this.moveGroupUp.bind(this);
    this.moveGroupDown = this.moveGroupDown.bind(this);
    this.parametersChanged = this.parametersChanged.bind(this);

    this.init(parameters);
  }

  async init(parameters) {
    this._trees = [];
    this._selectedTree = null;
    this._groups = [];
    this._selectedGroup = null;
    this._bookmarks = [];
    this._parent = null;
    this._mode = 'init';

    let res = await this._ps.oneshot({
      action: 'treesByUserId',
      userId: '1'
    });

    this._trees = res.result;
    this._selectedTree = this._trees.find(elem => elem.id == parameters.treeId);

    if (!this._selectedTree) {
      this._selectedTree = this._trees.find(function(elem) { return elem.default; });
    }

    if (parameters.groupId) {
      res = await this._ps.oneshot({
        action: 'groupByIdTreeId',
        groupId: parameters.groupId,
        treeId: parameters.treeId
      });
  
      this._selectedGroup = res.result;
    }

    if (this._selectedGroup) {
      res = await this._ps.oneshot({
        action: 'parentByGroupIdTreeId',
        groupId: this._selectedGroup.id,
        treeId: this._selectedGroup.treeId
      });

      this._parent = res.result;
    }

    this._requestGroups();
    this._requestBookmarks();
    this._mode = 'view';
  }

  get trees() {
    return this._trees;
  }

  get selectedTree() {
    return this._selectedTree;
  }

  get groups() {
    return this._groups;
  }

  get bookmarks() {
    return this._bookmarks;
  }

  get title() {
    return (this._selectedGroup || this._selectedTree || {name: ''}).name;
  }

  get mode() {
    return this._mode;
  }

  get parent() {
    return this._parent;
  }

  moveGroupUp(group) {
    let container = this._selectedGroup || this._selectedTree;
    
    if (!container) {
      return;
    }
    
    let grpIdx = container.groupIds.findIndex(elem => {
      return elem == group.id;
    });
    
    if (grpIdx < 1) {
      return;
    }

    container.groupIds = this._moveElementAtIndexUp(container.groupIds, grpIdx);
    this._groups = this._moveElementAtIndexUp(this._groups, grpIdx);
  }

  moveGroupDown(group) {
    let container = this._selectedGroup || this._selectedTree;
    
    if (!container) {
      return;
    }
    
    let grpIdx = container.groupIds.findIndex(elem => {
      return elem == group.id;
    });
    
    if (grpIdx >= container.groupIds - 1) {
      return;
    }

    container.groupIds = this._moveElementAtIndexUp(container.groupIds, grpIdx + 1);
    this._groups = this._moveElementAtIndexUp(this._groups, grpIdx + 1);
  }

  _moveElementAtIndexUp(arr, idx) {
    if (idx < 1) {
      return arr;
    }

    let res = [];

    for (let arrIdx in arr) {
      if (arrIdx == idx - 1) {
        res.push(arr[idx]);
      } else if (arrIdx == idx) {
        res.push(arr[idx - 1]);
      } else {
        res.push(arr[arrIdx]);
      }
    }

    return res;
  }

  parametersChanged(parameters) {
    this.init(parameters);
  }

  ok() {
    if (this._mode == 'reorder') {
      let container = this._selectedGroup || this._selectedTree;
      let requestId = this._uuid();
      let token = this._ps.subscribe({
        type: 'response',
        action: 'persistObjects',
        id: requestId
      }, function(res) {
        this._ps.unsubscribe(token);

        if (this._selectedGroup) {
          this._selectedGroup = res.objects[0];
        } else if (this._selectedTree) {
          this._selectedTree = res.objects[0];
        }

        this._mode = 'view';
      }.bind(this));

      this._mode = 'working';

      this._ps.publish({
        type: 'request',
        action: 'persistObjects',
        id: requestId,
        objects: [container]
      });
    }
  }

  cancel() {
    this._mode = 'view';
  }

  switchToReorderMode() {
    this._mode = 'reorder';
  }

  _requestGroups() {
    let groupIds, treeId;

    if (!this._selectedGroup) {
      groupIds = this._selectedTree.groupIds;
      treeId = this._selectedTree.id;
    } else {
      groupIds = this._selectedGroup.groupIds;
      treeId = this._selectedGroup.treeId;      
    }

    this._ps.publish({
      type: 'request',
      action: 'groupsByIds',
      groupIds: groupIds,
      treeId: treeId
    });
  }

  _requestBookmarks() {
    let bookmarkIds, treeId;

    if (!this._selectedGroup) {
      bookmarkIds = this._selectedTree.bookmarkIds;
      treeId = this._selectedTree.id;
    } else {
      bookmarkIds = this._selectedGroup.bookmarkIds;
      treeId = this._selectedGroup.treeId;      
    }

    this._ps.publish({
      type: 'request',
      action: 'bookmarksByIds',
      bookmarkIds: bookmarkIds,
      treeId: treeId
    });
  }
}
