![CI](https://github.com/hannes-hochreiner/more-bookmarks/workflows/CI/badge.svg)
# more-bookmarks

This is a simple bookmarking app I wrote to scratch a personal itch.

# Requirements

  1) The system must allow the user to share their bookmarks across different devices (laptop, mobile, etc).
  2) The system must allow the user to add, edit, remove, and open bookmarks.
  3) The system must allow the user to organize the bookmarks in hierarchical structure of groups.
  4) The system must work on Chrome, Firefox, IE, and Edge.

# Architecture

The system is implemented as a web application with a CouchDb backend.
Vue.js is used as the web framework.
The components communicate via the Broadcast Channel.
PouchDb will be used as local repository running in a web worker.
This will ensure that the application is available even if the server should not be reachable.
Since the bookmarks will almost exclusively point to resources on the web, the system will not be built as a full offline-app.
Authentication will be done via AWS.

# Technical details

## Model

### Tree

  * _id: /trees/<uuid>; couchdb internal
  * _rev: couchdb internal
  * id: uuid
  * default: true | false
  * name
  * sharedWith: array of user ids
  * groupIds: array of groups ids (the order of entries in the array is significant)
  * bookmarkIds: array of bookmarks ids (the order of entries in the array is significant)

### Group

  * _id: /groups/<tree id>/<uuid>; couchdb internal
  * _rev: couchdb internal
  * id: uuid
  * treeId: id of the tree
  * name
  * groupIds: array of groups ids (the order of entries in the array is significant)
  * bookmarkIds: array of bookmarks ids (the order of entries in the array is significant)
  
### Bookmark

  * _id: /bookmarks/<tree id>/<uuid>; couchdb internal
  * _rev: couchdb internal
  * id: uuid
  * treeId: id of the tree
  * name
  * url

## Channel

Messages are exchanges on a broadcast channel named "net.hochreiner.more-bookmarks".

## Messages

Every message is an object having at least an "id", "type", and "action".

### Id

The id is a UUID uniquely identifying each instance of an action.
This means that the combination of "action" and "id" must uniquely identify a message.

### Type

There are three types of messages: request, response, and broadcast.
If a response to a request is sent, the "action" and "id" of the request must coincide with the same fields in the response.
A response should only be sent as an answer to a request.
Messages sent without a corresponding request should be sent as broadcasts.

### Action

Describes what is requested or broadcast.
Possible values and their associated additional fields are found below.

#### repositoryReady (broadcast)

  * No additional fields.

#### treesByUserId (request)

  * userId

#### treesByUserId (response)

  * userId
  * result (optional): an array of tree objects; can be empty
  * error (optional): the error that occurred in retrieving the tree objects

#### bookmarksByIds (request)

  * treeId
  * bookmarksIds: array of bookmark ids

#### bookmarksByIds (response)

  * treeId
  * bookmarksIds: array of bookmark ids
  * result (optional): an array of bookmark objects; can be empty
  * error (optional): the error that occurred in retrieving the bookmark objects

#### groupsByIds (request)

  * treeId
  * groupIds: array of group ids

#### groupsByIds (response)

  * treeId
  * groupIds: array of group ids
  * result (optional): an array of group objects; can be empty
  * error (optional): the error that occurred in retrieving the bookmark objects
