import View from './view';
import icons from 'url:../../img/icons.svg';
class ResultsView extends View {
  _parentEl = document.querySelector('.results');
  _renderErrorMessage = 'No recipe found';
  _generateMarkup() {
    return this._data.map(ele => this._generateList(ele)).join(' ');
  }
  _generateList(ele) {
    const id = window.location.hash.slice(1);
    return `
        <li class="preview">
            <a class="preview__link ${
              ele.id === id ? 'preview__link--active' : ''
            } " href="#${ele.id}">
            <figure class="preview__fig">
                <img src="${ele.image}" alt="Test" />
            </figure>
            <div class="preview__data">
                <h4 class="preview__title">${ele.title}</h4>
                <p class="preview__publisher">${ele.publisher}</p>
                <div class="preview__user-generated">
                <svg>
                    <use href="${icons}#icon-user"></use>
                </svg>
                </div>
            </div>
            </a>
        </li>`;
  }
}

export default new ResultsView();
