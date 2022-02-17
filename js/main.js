var $formHome = document.querySelector('.form-home');

$formHome.addEventListener('submit', handleSearch);

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
