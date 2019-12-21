import {BookmarksVM} from './viewModels/BookmarksVM';

export class ViewModelFactory {
  constructor(psf) {
    this._psf = psf;
  }

  createViewModel(className) {
    if (className === 'bookmarks') {
      return new BookmarksVM(this._psf.createInstance());
    }
  }
}
