import {default as uuid} from 'uuid/v4';
import {PubSub} from './PubSub';
import {Repository} from './Repository.mock';

let ps = new PubSub('net.hochreiner.more-bookmarks', uuid);
new Repository(ps);
