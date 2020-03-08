export class Repository {
  constructor(pubsub, uuid, xhr) {
    this._uuid = uuid;
    this._xhr = xhr;
    this._ps = pubsub;
    this._ps.subscribe({type: 'request', action: 'parentByGroupIdTreeId'}, this._parentByGroupIdTreeId.bind(this));
    this._ps.subscribe({type: 'request', action: 'treesByUserId'}, this._treesByUserId.bind(this));
    this._ps.subscribe({type: 'request', action: 'bookmarksByIds'}, this._bookmarksByIds.bind(this));
    this._ps.subscribe({type: 'request', action: 'groupsByIds'}, this._groupsByIds.bind(this));
    this._ps.subscribe({type: 'request', action: 'persistObjects'}, this._persistObjects.bind(this));
    this._ps.subscribe({type: 'request', action: 'deleteObjects'}, this._deleteObjects.bind(this));
    this._ps.subscribe({type: 'request', action: 'groupByIdTreeId'}, this._groupByIdTreeId.bind(this));
    this._ps.publish({type: 'broadcast', action: 'repositoryReady'});
  }

  async _query(q) {
    q.baseURL = '/api';

    if (!q.headers) {
      q.headers = {};
    }

    let idToken = (await this._ps.oneshot({type: 'request', action: 'getIdToken'})).idToken;
    q.headers['Authorization'] = `Bearer ${idToken}`;

    return this._xhr.request(q);
  }

  async _parentByGroupIdTreeId(req) {
    try {
      let res = await this._query({
        method: 'get',
        url: '/_design/bookmark/_view/parentByTreeIdGroupId',
        params: {
          key: [req.treeId, req.groupId],
          include_docs: true
        }
      });

      req.type = 'response';
      req.result = res.data.rows.map(elem => elem.doc)[0];
      this._ps.publish(req);
    } catch (error) {
      req.type = 'response';
      req.error = error;
      this._ps.publish(req);
    }
  }

  async _groupByIdTreeId(req) {
    try {
      let res = await this._query({
        method: 'get',
        url: `group_${req.treeId}_${req.groupId}`
      });

      req.type = 'response';
      req.result = res.data;
      this._ps.publish(req);
    } catch (error) {
      req.type = 'response';
      req.error = error;
      this._ps.publish(req);
    }
  }

  async _treesByUserId(req) {
    try {
      let res = await this._query({
        method: 'get',
        url: '/_design/bookmark/_view/treesByUserId',
        params: {
          key: `"${req.userId}"`,
          include_docs: true
        }
      });

      this._ps.publish({
        type: 'response',
        action: req.action,
        userId: req.userId,
        id: req.id,
        result: res.data.rows.map(elem => elem.doc).filter(elem => elem.sharedWith.includes(req.userId))
      });
    } catch (error) {
      req.type = 'response';
      req.error = error;
      this._ps.publish(req);
    }
  }

  async _bookmarksByIds(req) {
    try {
      let res = await this._query({
        method: 'post',
        url: '/_bulk_get',
        data: {
          docs: req.bookmarkIds.map(elem => {
            return { id: `bookmark_${req.treeId}_${elem}`}
          })  
        }  
      });  
      
      req.type = 'response';
      req.result = res.data.results.map(elem => elem.docs[0].ok);
      this._ps.publish(req);
    } catch (error) {
      req.type = 'response';
      req.error = error;
      this._ps.publish(req);
    }
  }

  async _groupsByIds(req) {
    try {
      let res = await this._query({
        method: 'post',
        url: '/_bulk_get',
        data: {
          docs: req.groupIds.map(elem => {
            return { id: `group_${req.treeId}_${elem}`}
          })
        }
      });
  
      req.type = 'response';
      req.result = res.data.results.map(elem => elem.docs[0].ok);
      this._ps.publish(req);
    } catch (error) {
      req.type = 'response';
      req.error = error;
      this._ps.publish(req);
    }
  }

  async _deleteObjects(req) {
    try {
      for (let idx in req.objects) {
        let obj = req.objects[idx];

        obj._deleted = true;
        await this._query({
          method: 'put',
          url: `/${obj._id}`,
          data: {
            _id: obj._id,
            _rev: obj._rev,
            _deleted: true
          }
        });
      }
  
      req.type = 'response';
      this._ps.publish(req);
    } catch (error) {
      req.type = 'response';
      req.error = error;
      this._ps.publish(req);
    }
  }

  async _persistObjects(req) {
    try {
      for (let idx in req.objects) {
        let obj = req.objects[idx];
  
        if (!obj._id) {
          if (obj.type == 'tree') {
            obj._id = `${obj.type}_${obj.id}`;
          } else {
            obj._id = `${obj.type}_${obj.treeId}_${obj.id}`;
          }
        }
  
        let res = await this._query({
          method: 'put',
          url: `/${obj._id}`,
          data: obj
        });
  
        obj._rev = res.data.rev;
      }
  
      req.type = 'response';
      this._ps.publish(req);
    } catch (error) {
      req.type = 'response';
      req.error = error;
      this._ps.publish(req);
    }
  }
}
