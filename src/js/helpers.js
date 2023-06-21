import { TIMEOUT_SEC } from './config';
import recipeViews from './views/recipeViews';

export const getSJSON = async function (url) {
  try {
    const items = await fetch(url);
    if (!items.ok) {
      recipeViews.errorHandler();
    }
    const res = await Promise.race([items, timeout(TIMEOUT_SEC)]);
    if (!res.ok) {
      throw new Error(`${data.message} Status code ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (err) {
    throw err;
  }
};
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    if (!res.ok) {
      throw new Error(`${data.message} Status code ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (err) {
    throw err;
  }
};
