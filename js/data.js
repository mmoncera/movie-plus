/* exported data */

var data = {
  view: 'home',
  searchInput: null,
  selectedMovieId: null,
  selectedInfoCard: null,
  searchResults: [],
  watchlist: []
};

var previousDataJSON = localStorage.getItem('javascript-local-storage');

if (previousDataJSON !== null) {
  data = JSON.parse(previousDataJSON);
}

function handleBeforeUnload(event) {
  var dataJSON = JSON.stringify(data);
  localStorage.setItem('javascript-local-storage', dataJSON);
}

window.addEventListener('beforeunload', handleBeforeUnload);

// localStorage.clear();
