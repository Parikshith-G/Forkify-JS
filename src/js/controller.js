import { TIMEOUT } from './config';
import {
  addBookMark,
  deleteBookmarks,
  getSearchResultsPerPage,
  loadRecipe,
  loadSearchResults,
  state,
  updateServigs,
  uploadRecipe,
} from './model';
import addRecipiesView from './views/addRecipiesView';

import bookmarksView from './views/bookmarksView';
import paginationView from './views/paginationView';
import recipeViews from './views/recipeViews';
import resultsView from './views/resultsView';
import searchView from './views/searchView';

// https://forkify-api.herokuapp.com/v2
// api key - 562e0d28-0525-46bd-981a-0760e025891a
//https://forkify-api.herokuapp.com/api/v2/recipes?search=pizza
///////////////////////////////////////
// if (module.hot) {
//   module.hot.accept();
// }
const showRecipie = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeViews.renderSpinner();
    resultsView.update(getSearchResultsPerPage());
    bookmarksView.update(state.bookmarks);
    await loadRecipe(id);

    const recipe = state.recipe;
    recipeViews.render(recipe);
  } catch (err) {
    recipeViews.errorHandler();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    const query = searchView.getQuery();
    if (!query) return;

    await loadSearchResults(query);
    resultsView.render(getSearchResultsPerPage(1));
    paginationView.render(state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlServings = function (newServings) {
  updateServigs(newServings);
  recipeViews.update(state.recipe);
};
const controlPageination = function (goto) {
  resultsView.render(getSearchResultsPerPage(goto));
  paginationView.render(state.search);
};

const controlAddBookmark = function () {
  if (!state.recipe.bookmarked) addBookMark(state.recipe);
  else if (state.recipe.bookmarked) {
    deleteBookmarks(state.recipe.id);
  }
  recipeViews.update(state.recipe);

  bookmarksView.render(state.bookmarks);
};
const renderBookmarksStored = function () {
  bookmarksView.render(state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipiesView.renderSpinner();
    await uploadRecipe(newRecipe);
    console.log(state.recipe);
    recipeViews.render(state.recipe);
    bookmarksView.render(state.bookmarks);
    window.history.pushState(null, '', `#${state.recipe.id}`);

    setTimeout(() => {
      addRecipiesView.toggleWindow();
    }, TIMEOUT * 1000);
  } catch (err) {
    addRecipiesView.errorHandler(err.message);
  }
};
const init = function () {
  bookmarksView.addHandlerRender(renderBookmarksStored);
  recipeViews.addHandlerRender(showRecipie);
  searchView.searchButton(controlSearchResults);
  paginationView.addHandler(controlPageination);
  recipeViews._updateServings(controlServings);
  recipeViews.bookmarkHandler(controlAddBookmark);
  addRecipiesView.addHandlerUpload(controlAddRecipe);
};

init();
