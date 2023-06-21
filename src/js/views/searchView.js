class SearchView {
  _parentEl = document.querySelector('.search');
  getQuery() {
    const val = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return val;
  }
  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }
  searchButton(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}
export default new SearchView();
