import icons from 'url:../../img/icons.svg';
export default class View {
  _data;
  
  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Parikshith
   * @todo Finish implementation
   */
  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.errorHandler();
    this._data = data;
    const html = this._generateMarkup();
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', html);
  }

  _clear() {
    this._parentEl.innerHTML = '';
  }
  update(data) {
    this._data = data;
    const html = this._generateMarkup();
    const newDom = document.createRange().createContextualFragment(html);
    const newElement = Array.from(newDom.querySelectorAll('*'));
    const currentElement = Array.from(this._parentEl.querySelectorAll('*'));
    newElement.forEach((newEl, index) => {
      let currentEl = currentElement[index];
      if (
        !newEl.isEqualNode(currentEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        currentEl.textContent = newEl.textContent;
      }
      if (!newEl.isEqualNode(currentEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          currentEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }
  errorHandler(message = this._renderErrorMessage) {
    const html = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
    </div>`;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', html);
  }
  renderSpinner() {
    let html = `<div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>`;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', html);
  }
}
