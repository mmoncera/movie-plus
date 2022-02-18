/*
************************************************
DOM Nodes
************************************************
*/
var $appHome = document.querySelector('.app-home');
var $dataView = document.querySelectorAll('[data-view]');
var $formHome = document.querySelector('.form-home');

/*
************************************************
Utility Functions
************************************************
*/

function switchDataView(view) {
  $dataView.forEach(element => {
    if (element.dataset.view !== view) {
      element.classList.add('hidden');
    } else {
      element.classList.remove('hidden');
      data.view = view;
    }
  });
}

function searchMovie(response) {
  response.forEach(({ imdbID, Poster, Title, Year }) => {
    if (Poster !== 'N/A') {
      var movie = {
        imdbID,
        Poster,
        Title,
        Year
      };
      data.searchResults.push(movie);
    }
  });
}

/*
************************************************
Event Listener Handlers
************************************************
*/
function handleHomeView(event) {
  switchDataView('home');
}

function handleSearch(event) {
  event.preventDefault();
  data.searchResults = [];
  data.searchInput = $formHome.elements.search.value;
  var searchQuery = new XMLHttpRequest();
  searchQuery.open(
    'GET',
    `http://www.omdbapi.com/?apikey=f1112d72&type=movie&s=${data.searchInput}`
  );
  searchQuery.responseType = 'json';
  searchQuery.addEventListener('load', function (event) {
    // console.log(searchQuery.response);
    searchMovie(searchQuery.response.Search);
  });
  searchQuery.send();
  switchDataView('search-results');
}

/*
************************************************
Event Listners
************************************************
*/
$appHome.addEventListener('click', handleHomeView);
$formHome.addEventListener('submit', handleSearch);
