var $form = document.querySelector('.form');

$form.addEventListener('submit', handleSearch);

function handleSearch(event) {
  event.preventDefault();
  data.searchResults = [];
  data.searchInput = $form.elements.search.value;
  var searchQuery = new XMLHttpRequest();
  searchQuery.open(
    'GET',
    `http://www.omdbapi.com/?apikey=f1112d72&type=movie&s=${data.searchInput}`
  );
  searchQuery.responseType = 'json';
  searchQuery.addEventListener('load', function () {
    searchQuery.response.Search.forEach(({ imdbID, Poster, Title, Year }) => {
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
  searchQuery.send();
}
