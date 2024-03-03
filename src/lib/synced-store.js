import { writable } from 'svelte/store';

export const writableSync = (defaultValue, key) => {
  let localStorageValue = localStorage[key];
  try {
    localStorageValue = JSON.parse(localStorageValue);
  } catch {}
  const store = writable(localStorage[key] ? JSON.parse(localStorage[key]) : defaultValue);
  store.subscribe((newValue) => (localStorage[key] = JSON.stringify(newValue)));
  return store;
};
