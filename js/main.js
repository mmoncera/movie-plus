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
var $movieCardsContainer = document.querySelector('.movie-cards-container');

/*
************************************************
Event Listners
************************************************
*/
window.addEventListener('DOMContentLoaded', handleLoadDomContent);
$appHome.addEventListener('click', handleHomeView);
$formHome.addEventListener('submit', handleSubmit);
$formSearchResults.addEventListener('submit', handleSubmit);
$movieCardsContainer.addEventListener('click', handleMovieInfoView);

/*
************************************************
Event Handlers
************************************************
*/
function handleLoadDomContent(event) {
  switchDataView(data.view);
  if (data.view === 'search-results') {
    searchMovie();
  }
}

function handleHomeView(event) {
  switchDataView('home');
}

function handleSubmit() {
  event.preventDefault();
  data.searchInput = this.search.value;
  $movieCardsContainer.innerHTML = '';
  searchMovie();
  this.reset();
  switchDataView('search-results');
}

function handleMovieInfoView(event) {
  if (
    event.target &&
    (event.target.matches('.movie-card-info-icon') ||
      event.target.matches('.movie-card-info-text'))
  ) {
    switchDataView('movie-info');
    var closestMovieId =
      event.target.closest('[data-movie-id]').dataset.movieId;
    data.selectedMovieId = closestMovieId;
  }
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
    `https://www.omdbapi.com/?apikey=f1112d72&type=movie&s=${data.searchInput}`
  );
  xhr.responseType = 'json';

  data.searchResults = [];
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
        $movieCardsContainer.append(renderMovieCard(movie));
      }
    });
  });
  xhr.send();
}

function renderMovieCard(movie) {
  /*
  <li class="movie-card column-half" data-movie-id=`{movie.imdbID}`>
    <div class="movie-card-poster-container row">
      <img
        class="movie-card-poster"
        src=`${movie.Poster}
        alt=`{movie.Title}`
      />
    </div>
    <div class="movie-card-info-container row">
        <i class="fa-solid fa-circle-info movie-card-info-icon"></i>
        <span class="movie-card-info-text">Details</span>
    </div>
  </li>
  */

  var $movieCard = document.createElement('li');
  var $movieCardPosterContainer = document.createElement('div');
  var $movieCardPoster = document.createElement('img');
  var $movieCardInfoContainer = document.createElement('div');
  var $movieCardInfoIcon = document.createElement('i');
  var $movieCardInfoText = document.createElement('span');

  $movieCard.setAttribute('class', 'movie-card column-half');
  $movieCard.setAttribute('data-movie-id', movie.imdbID);
  $movieCardPosterContainer.setAttribute(
    'class',
    'movie-card-poster-container row'
  );
  $movieCardPoster.setAttribute('class', 'movie-card-poster');
  $movieCardPoster.setAttribute('src', movie.Poster);
  $movieCardPoster.setAttribute('alt', movie.Title);
  $movieCardInfoContainer.setAttribute(
    'class',
    'movie-card-info-container row'
  );
  $movieCardInfoIcon.setAttribute(
    'class',
    'fa-solid fa-circle-info movie-card-info-icon'
  );
  $movieCardInfoText.setAttribute('class', 'movie-card-info-text');
  $movieCardInfoText.textContent = 'Details';

  $movieCard.append($movieCardPosterContainer, $movieCardInfoContainer);
  $movieCardPosterContainer.appendChild($movieCardPoster);
  $movieCardInfoContainer.append($movieCardInfoIcon, $movieCardInfoText);

  return $movieCard;
}
