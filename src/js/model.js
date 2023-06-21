import { API_URL, KEY, RESULTSPERPAGE } from './config';
import { getSJSON, sendJSON } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RESULTSPERPAGE,
  },
  bookmarks: [],
};
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceURL: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && {key: recipe.key})
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await getSJSON(`${API_URL}/${id}`);
    state.recipe=createRecipeObject(data);
    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await getSJSON(`${API_URL}?search=${query}`);
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPerPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServigs = function (inc) {
  state.recipe.ingredients.forEach(
    ele => (ele.quantity *= inc / state.recipe.servings)
  );
  state.recipe.servings = inc;
};

export const addBookMark = function (recipe) {
  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

export const deleteBookmarks = function (id) {
  const index = state.bookmarks.findIndex(ele => ele.id === id);
  state.bookmarks.splice(index, 1);

  if (state.recipe.id === id) state.recipe.bookmarked = false;
  persistBookmarks();
};
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const restoreBookmarks = function () {
  let bookmarks = localStorage.getItem('bookmarks');
  if (bookmarks) {
    state.bookmarks = JSON.parse(bookmarks);
  }
};
export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const newArr = ing[1].replaceAll(' ', '').split(',');
        if (newArr.length !== 3) {
          throw new Error('Use Correct Fromat');
        }
        const [quantity, unit, description] = newArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: +newRecipe.servings,
      cooking_time: +newRecipe.cookingTime,
      ingredients,
    };
    const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
    state.recipe=createRecipeObject(data);
    addBookMark(state.recipe)
  } catch (err) {
    throw err;
  }
};
restoreBookmarks();
