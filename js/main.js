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
var $infoCardContainer = document.querySelector('.info-card-container');

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
$infoCardContainer.addEventListener('click', handleAddWatchlist);
$infoCardContainer.addEventListener('click', handleBackButton);

/*
************************************************
Event Handlers
************************************************
*/
function handleLoadDomContent(event) {
  switchDataView(data.currentView);
  if (data.currentView === 'search-results') {
    searchMovie();
  } else if (data.currentView === 'movie-info') {
    searchMovieImdbId();
  }
}

function handleHomeView(event) {
  switchDataView('home');
}

function handleSubmit() {
  event.preventDefault();
  data.searchInput = this.search.value;
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
    data.previousView = data.currentView;
    switchDataView('movie-info');
    var closestMovieId =
      event.target.closest('[data-movie-id]').dataset.movieId;
    data.selectedMovieId = closestMovieId;
    searchMovieImdbId();
  }
}

function handleAddWatchlist(event) {
  if (event.target && event.target.matches('.info-card-nav-add')) {
    if (getWatchlistIndex() === -1) {
      event.target.classList.replace('fa-plus', 'fa-check');
      data.watchlist.unshift(data.selectedInfoCard);
    } else {
      event.target.classList.replace('fa-check', 'fa-plus');
      data.watchlist.splice(getWatchlistIndex(), 1);
    }
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
      data.currentView = view;
    }
  });
}

function searchMovie() {
  data.searchResults = [];
  $movieCardsContainer.innerHTML = '';
  var xhr = new XMLHttpRequest();
  xhr.open(
    'GET',
    `https://www.omdbapi.com/?apikey=f1112d72&type=movie&s=${data.searchInput}`
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
        $movieCardsContainer.append(renderMovieCard(movie));
      }
    });
  });
  xhr.send();
}

function renderMovieCard(movie) {
  /*
  <li class="movie-card column-half" data-movie-id=`${movie.imdbID}`>
    <div class="movie-card-poster-container row">
      <img
        class="movie-card-poster"
        src=`${movie.Poster}`
        alt=`${movie.Title}`
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

function searchMovieImdbId() {
  $infoCardContainer.innerHTML = '';
  var xhr = new XMLHttpRequest();
  xhr.open(
    'GET',
    `https://www.omdbapi.com/?apikey=f1112d72&i=${data.selectedMovieId}`
  );
  xhr.responseType = 'json';
  xhr.addEventListener('load', function (event) {
    var { imdbID, Poster, Title, Year, Plot, Director, Actors } = xhr.response;
    var movieInfo = {
      imdbID,
      Poster,
      Title,
      Year,
      Plot,
      Director,
      Actors
    };
    data.selectedInfoCard = movieInfo;
    $infoCardContainer.appendChild(renderInfoCard(movieInfo));
  });
  xhr.send();
}

function renderInfoCard(movie) {
  /*
  <div class="info-card" data-movie-id=`${movie.imdbID}>
    <div class="info-card-poster-container row">
      <img
        class="info-card-poster column-full"
        src=`${movie.Poster}`
        alt=`${movie.Title}`
      />
    </div>
    <div class="info-card-details-container row">
      <p class="info-card-details-title-year column-full">`${movie.Title} ($${movie.Year})`</p>
      <p class="info-card-details-plot column-full">`${movie.Plot}`</p>
      <div class="info-card-details-director-container column-full">
        <span class="info-card-details-director-title">DIRECTOR</span>
        <span class="info-card-details-director-names">`${movie.Director}`</span>
      </div>
      <div class="info-card-details-cast-container column-full">
        <span class="info-card-details-cast-title">CAST</span>
        <span class="info-card-details-cast-names">`${movie.Actors}`</span>
      </div>
    </div>
    <div class="info-card-nav-container row">
      <i class="fa-solid fa-chevron-left info-card-nav-back"></i>
      <i class="fa-solid fa-plus info-card-nav-add"></i>
    </div>
  </div>
  */

  var $infoCard = document.createElement('div');
  var $infoCardPosterContainer = document.createElement('div');
  var $infoCardPoster = document.createElement('img');
  var $infoCardDetailsContainer = document.createElement('div');
  var $infoCardDetailsTitleYear = document.createElement('p');
  var $infoCardDetailsPlot = document.createElement('p');
  var $infoCardDetailsDirectorContainer = document.createElement('div');
  var $infoCardDetailsDirectorTitle = document.createElement('span');
  var $infoCardDetailsDirectorNames = document.createElement('span');
  var $infoCardDetailsCastContainer = document.createElement('div');
  var $infoCardDetailsCastTitle = document.createElement('span');
  var $infoCardDetailsCastNames = document.createElement('span');
  var $infoCardNavContainer = document.createElement('nav');
  var $infoCardNavBack = document.createElement('i');
  var $infoCardNavAdd = document.createElement('i');

  $infoCard.setAttribute('class', 'info-card');
  $infoCard.setAttribute('data-movie-id', movie.imdbID);
  $infoCardPosterContainer.setAttribute(
    'class',
    'info-card-poster-container row'
  );
  $infoCardPoster.setAttribute('class', 'info-card-poster column-full');
  $infoCardPoster.setAttribute('src', movie.Poster);
  $infoCardPoster.setAttribute('alt', movie.Title);
  $infoCardDetailsContainer.setAttribute(
    'class',
    'info-card-details-container row'
  );
  $infoCardDetailsTitleYear.setAttribute(
    'class',
    'info-card-details-title-year column-full'
  );
  $infoCardDetailsTitleYear.textContent = `${movie.Title} (${movie.Year})`;
  $infoCardDetailsPlot.setAttribute(
    'class',
    'info-card-details-plot column-full'
  );
  $infoCardDetailsPlot.textContent = movie.Plot;
  $infoCardDetailsDirectorContainer.setAttribute(
    'class',
    'info-card-details-director-container column-full'
  );
  $infoCardDetailsDirectorTitle.setAttribute(
    'class',
    'info-card-details-director-title'
  );
  $infoCardDetailsDirectorTitle.textContent = 'DIRECTOR';
  $infoCardDetailsDirectorNames.setAttribute(
    'class',
    'info-card-details-director-names'
  );
  $infoCardDetailsDirectorNames.textContent = movie.Director;
  $infoCardDetailsCastContainer.setAttribute(
    'class',
    'info-card-details-cast-container column-full'
  );
  $infoCardDetailsCastTitle.setAttribute(
    'class',
    'info-card-details-cast-title'
  );
  $infoCardDetailsCastTitle.textContent = 'CAST';
  $infoCardDetailsCastNames.setAttribute(
    'class',
    'info-card-details-cast-names'
  );
  $infoCardDetailsCastNames.textContent = movie.Actors;
  $infoCardNavContainer.setAttribute('class', 'info-card-nav-container row');
  $infoCardNavBack.setAttribute(
    'class',
    'fa-solid fa-chevron-left info-card-nav-back'
  );

  if (getWatchlistIndex() === -1) {
    $infoCardNavAdd.setAttribute('class', 'fa-solid fa-plus info-card-nav-add');
  } else {
    $infoCardNavAdd.setAttribute(
      'class',
      'fa-solid fa-check info-card-nav-add'
    );
  }

  $infoCard.append(
    $infoCardPosterContainer,
    $infoCardDetailsContainer,
    $infoCardNavContainer
  );
  $infoCardPosterContainer.appendChild($infoCardPoster);
  $infoCardDetailsContainer.append(
    $infoCardDetailsTitleYear,
    $infoCardDetailsPlot,
    $infoCardDetailsDirectorContainer,
    $infoCardDetailsCastContainer
  );
  $infoCardDetailsDirectorContainer.append(
    $infoCardDetailsDirectorTitle,
    $infoCardDetailsDirectorNames
  );
  $infoCardDetailsCastContainer.append(
    $infoCardDetailsCastTitle,
    $infoCardDetailsCastNames
  );
  $infoCardNavContainer.append($infoCardNavBack, $infoCardNavAdd);

  return $infoCard;
}

function getWatchlistIndex() {
  var watchlistIndex = data.watchlist.findIndex(
    ({ imdbID }) => imdbID === data.selectedMovieId
  );
  return watchlistIndex;
}

function handleBackButton(event) {
  if (event.target && event.target.matches('.info-card-nav-back')) {
    switchDataView(data.previousView);
    searchMovie(data.searchInput);
  }
}
