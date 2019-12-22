import {BookmarksVM} from './viewModels/BookmarksVM';

export class ViewModelFactory {
  constructor(psf, uuid) {
    this._psf = psf;
    this._uuid = uuid;
  }

  createViewModel(className, parameters) {
    if (className === 'bookmarks') {
      return new BookmarksVM(this._psf.createInstance(), this._uuid, parameters);
    }
  }
}
