export function storeToStorage(name, object) {
  localStorage.setItem(name, JSON.stringify(object));
}

export function getFromStorage(name) {
  return JSON.parse(localStorage.getItem(name));
}
