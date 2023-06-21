import View from './view';
import icons from 'url:../../img/icons.svg';
class PagainationView extends View {
  _parentEl = document.querySelector('.pagination');
  addHandler(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goto = Number(btn.dataset.goto);
      handler(goto);
    });
  }
  _generateMarkup() {
    const currentPage = this._data.page;
    const numberOfPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    //first page
    if (currentPage === 1 && numberOfPages > 1) {
      return this._nextPage();
    }
    //middle
    if (currentPage < numberOfPages) {
      let arr = [this._prevPage(), this._nextPage()];
      return arr.map(ele => ele);
    }
    //last page
    if (currentPage === numberOfPages && numberOfPages > 1) {
      return this._prevPage();
    }
    //only one page
    return '';
  }

  _nextPage() {
    return `
          <button data-goto="${
            this._data.page + 1
          }" class="btn--inline pagination__btn--next">
            <span>Page ${this._data.page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
  }
  _prevPage() {
    return `
    <button data-goto="${
      this._data.page - 1
    }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${this._data.page - 1}</span>
    </button>`;
  }
}

export default new PagainationView();
/* <button class="btn--inline pagination__btn--prev">
<svg class="search__icon">
  <use href="src/img/icons.svg#icon-arrow-left"></use>
</svg>
<span>Page 1</span>
</button>
<button class="btn--inline pagination__btn--next">
<span>Page 3</span>
<svg class="search__icon">
  <use href="src/img/icons.svg#icon-arrow-right"></use>
</svg>
</button> */
