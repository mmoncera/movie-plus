/* exported data */

var data = {
  currentView: 'home',
  previousView: null,
  searchInput: null,
  selectedMovieId: null,
  selectedInfoCard: null,
  searchResults: [],
  watchlist: []
};

var previousDataJSON = localStorage.getItem('ajax-project-local-storage');

if (previousDataJSON !== null) {
  data = JSON.parse(previousDataJSON);
}

window.addEventListener('beforeunload', handleBeforeUnload);

function handleBeforeUnload(event) {
  var dataJSON = JSON.stringify(data);
  localStorage.setItem('ajax-project-local-storage', dataJSON);
}
