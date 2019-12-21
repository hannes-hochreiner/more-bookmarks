export class BookmarksVM {
  constructor(ps) {
    this._ps = ps;
    this._trees = [];
    this._selectedTree = null;
    this._groups = [];
    this._selectedGroup = null;
    this._bookmarks = [];

    this._ps.subscribe({type: 'response', action: 'bookmarksByIds'}, function(data) {
      this._bookmarks = data.result;
    }.bind(this));
    this._ps.subscribe({type: 'response', action: 'groupsByIds'}, function(data) {
      this._groups = data.result;
    }.bind(this));
    this._ps.subscribe({type: 'response', action: 'treesByUserId'}, function(data) {
      this._trees = data.result;
      this._selectedTree = this._trees.find(function(elem) { return elem.default; });
      this._requestGroups();
      this._requestBookmarks();
    }.bind(this));

    this._ps.publish({
      type: 'request',
      action: 'treesByUserId',
      id: '1',
      userId: '1'
    });

    this.selectedTreeChanged = this.selectedTreeChanged.bind(this);
    this.selectedGroupChanged = this.selectedGroupChanged.bind(this);
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

  selectedTreeChanged(tree) {
    this._selectedTree = tree;
    this._selectedGroup = null;
    this._requestGroups();
    this._requestBookmarks();
  }

  selectedGroupChanged(group) {
    this._selectedGroup = group;
    this._requestGroups();
    this._requestBookmarks();
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
