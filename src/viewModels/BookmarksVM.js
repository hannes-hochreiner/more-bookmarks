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

    this.moveGroupUp = this.moveGroupUp.bind(this);
    this.moveGroupDown = this.moveGroupDown.bind(this);
    this.parametersChanged = this.parametersChanged.bind(this);
    this.updateGroup = this.updateGroup.bind(this);
    this.createGroup = this.createGroup.bind(this);
    this.deleteGroup = this.deleteGroup.bind(this);
    this.createBookmark = this.createBookmark.bind(this);
    this.updateBookmark = this.updateBookmark.bind(this);
    this.deleteBookmark = this.deleteBookmark.bind(this);
    this.reorderGroupsBookmarks = this.reorderGroupsBookmarks.bind(this);

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

  get group() {
    return this._selectedGroup;
  }

  async reorderGroupsBookmarks(data) {
    let groupIds = data.groups.map(elem => elem.id);
    let bookmarkIds = data.bookmarks.map(elem => elem.id);
    let container = this._selectedGroup || this._selectedTree;

    console.log(groupIds);
    console.log(bookmarkIds);
    console.log(container);

    container.groupIds = groupIds;
    container.bookmarkIds = bookmarkIds;
    
    await this._ps.oneshot({action: 'persistObjects', objects: [container]});
    this._ps.publish({
      type: 'broadcast',
      action: 'userMessage',
      message: {
        type: 'success',
        text: `Updated group and bookmark order of ${container.type} "${container.name}".`
      }
    });
    this.init({
      treeId: this._selectedTree.id,
      groupId: this._selectedGroup ? this._selectedGroup.id : null
    });
  }

  async deleteGroup(data) {
    let container = this._selectedGroup || this._selectedTree;
    let group = data.group;
    let idx = container.groupIds.findIndex((elem) => elem == group.id);

    container.groupIds.splice(idx, 1);

    let res = await this._getSubgroupsBookmarks(group);
    res.groups.push(group);

    await this._ps.oneshot({action: 'persistObjects', objects: [container]});
    await this._ps.oneshot({action: 'deleteObjects', objects: res.groups.concat(res.bookmarks)});
    this._ps.publish({
      type: 'broadcast',
      action: 'userMessage',
      message: {
        type: 'success',
        text: `Deleted group "${group.name}" including sub-groups and bookmarks.`
      }
    });
    this.init({
      treeId: this._selectedTree.id,
      groupId: this._selectedGroup ? this._selectedGroup.id : null
    });
  }

  async _getSubgroupsBookmarks(group) {
    let res = {
      groups: [],
      bookmarks: []
    };

    if (group.bookmarkIds.length > 0) {
      res.bookmarks = (await this._ps.oneshot({
        action: 'bookmarksByIds',
        bookmarkIds: group.bookmarkIds,
        treeId: group.treeId
      })).result;
    }

    if (group.groupIds.length == 0) {
      return res;
    }

    res.groups = (await this._ps.oneshot({
      action: 'groupsByIds',
      groupIds: group.groupIds,
      treeId: group.treeId
    })).result;

    let grps = res.groups;

    for (let grpIdx in grps) {
      let subRes = await this._getSubgroupsBookmarks(grps[grpIdx]);

      res.groups = res.groups.concat(subRes.groups);
      res.bookmarks = res.bookmarks.concat(subRes.bookmarks);
    }

    return res;
  }

  async deleteBookmark(data) {
    let container = this._selectedGroup || this._selectedTree;
    let bookmark = data.bookmark;
    let idx = container.bookmarkIds.findIndex((elem) => elem == bookmark.id);

    container.bookmarkIds.splice(idx, 1);
    await this._ps.oneshot({action: 'persistObjects', objects: [container]});
    await this._ps.oneshot({action: 'deleteObjects', objects: [bookmark]});
    this._ps.publish({
      type: 'broadcast',
      action: 'userMessage',
      message: {
        type: 'success',
        text: `Deleted bookmark "${bookmark.name}".`
      }
    });
    this.init({
      treeId: this._selectedTree.id,
      groupId: this._selectedGroup ? this._selectedGroup.id : null
    });
  }

  async updateBookmark(data) {
    let bookmark = data.bookmark;

    bookmark.name = data.name;
    bookmark.url = data.url;

    await this._ps.oneshot({action: 'persistObjects', objects: [bookmark]});
    this._ps.publish({
      type: 'broadcast',
      action: 'userMessage',
      message: {
        type: 'success',
        text: `Updated bookmark "${bookmark.name}".`
      }
    });
    this.init({
      treeId: this._selectedTree.id,
      groupId: this._selectedGroup ? this._selectedGroup.id : null
    });
  }

  async updateGroup(data) {
    let group = data.group;

    group.name = data.name;

    await this._ps.oneshot({action: 'persistObjects', objects: [group]});
    this._ps.publish({
      type: 'broadcast',
      action: 'userMessage',
      message: {
        type: 'success',
        text: `Updated group "${group.name}".`
      }
    });
    this.init({
      treeId: this._selectedTree.id,
      groupId: this._selectedGroup ? this._selectedGroup.id : null
    });
  }

  async createGroup(data) {
    let id = this._uuid();
    let newGrp = {
      id: id,
      type: 'group',
      name: data.name,
      treeId: this._selectedTree.id,
      groupIds: [],
      bookmarkIds: []
    };
    let container = this._selectedGroup || this._selectedTree;
    container.groupIds.unshift(id);
    let res = await this._ps.oneshot({
      action: 'persistObjects',
      objects: [newGrp, container]
    });
    this.groups.unshift(res.objects[0]);
    
    if (res.objects[1].type == 'tree') {
      this._selectedTree = res.objects[1];
    } else if (res.objects[1].type == 'group') {
      this._selectedGroup = res.objects[1];
    }
  }

  async createBookmark(data) {
    let id = this._uuid();
    let bookmark = {
      id: id,
      type: 'bookmark',
      name: data.name,
      url: data.url,
      treeId: this._selectedTree.id
    };
    let container = this._selectedGroup || this._selectedTree;
    container.bookmarkIds.unshift(id);
    let res = await this._ps.oneshot({
      action: 'persistObjects',
      objects: [bookmark, container]
    });
    this.bookmarks.unshift(res.objects[0]);
    
    if (res.objects[1].type == 'tree') {
      this._selectedTree = res.objects[1];
    } else if (res.objects[1].type == 'group') {
      this._selectedGroup = res.objects[1];
    }
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

  _requestGroups() {
    let groupIds, treeId;

    if (!this._selectedGroup) {
      groupIds = this._selectedTree.groupIds;
      treeId = this._selectedTree.id;
    } else {
      groupIds = this._selectedGroup.groupIds;
      treeId = this._selectedGroup.treeId;      
    }

    if (groupIds.length == 0) {
      return;
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

    if (bookmarkIds.length == 0) {
      return;
    }

    this._ps.publish({
      type: 'request',
      action: 'bookmarksByIds',
      bookmarkIds: bookmarkIds,
      treeId: treeId
    });
  }
}
