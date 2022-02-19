/*
************************************************
DOM Nodes
************************************************
*/
var $appHome = document.querySelector('.app-home');
var $dataView = document.querySelectorAll('[data-view]');
var $formHome = document.querySelector('.form-home');
var $formSearchResults = document.querySelector('.form-search-results');
var $searchMessage = document.querySelector('.search-message');

/*
************************************************
Event Listners
************************************************
*/
$appHome.addEventListener('click', handleHomeView);
$formHome.addEventListener('submit', handleSubmitHome);
$formSearchResults.addEventListener('submit', handleSubmitSearchResults);

/*
************************************************
Event Handlers
************************************************
*/
function handleHomeView(event) {
  switchDataView('home');
}

function handleSubmitHome(event) {
  event.preventDefault();
  data.searchResults = [];
  data.searchInput = $formHome.search.value;
  searchMovie();
  $formHome.reset();
  switchDataView('search-results');
}

function handleSubmitSearchResults(event) {
  event.preventDefault();
  data.searchResults = [];
  data.searchInput = $formSearchResults.search.value;
  searchMovie();
  $formSearchResults.reset();
}

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

function searchMovie() {
  var xhr = new XMLHttpRequest();
  xhr.open(
    'GET',
    `http://www.omdbapi.com/?apikey=f1112d72&type=movie&s=${data.searchInput}`
  );
  xhr.responseType = 'json';

  xhr.addEventListener('load', function (event) {
    if (xhr.status >= 400 || xhr.response.Response === 'False') {
      $searchMessage.textContent = `No results found for "${data.searchInput}"`;
      return;
    }

    xhr.response.Search.forEach(({ imdbID, Poster, Title, Year }) => {
      $searchMessage.textContent = `Search results for "${data.searchInput}"`;
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
  });
  xhr.send();
}
