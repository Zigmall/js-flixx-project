import TOKEN from './config.js';

const global = {
  currentPage: window.location.pathname
};

const displayPopularMovies = async () => {
  const { results } = await fetchAPIData('movie/popular');
  console.log(results);
};

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `bearer ${TOKEN}`
  }
};

const highlightActiveLink = () => {
  const links = document.querySelectorAll('.nav-link');
  links.forEach((link) => {
    if (link.getAttribute('href') === global.currentPage) {
      link.classList.add('active');
    }
  });
};

const fetchAPIData = async (endpoint) => {
  const API_URL = 'https://api.themoviedb.org/3/';

  const response = await fetch(`${API_URL}${endpoint}?language=en-UK`, options);
  const data = response.json();
  return data;
};

// Init App
const init = () => {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      displayPopularMovies();
      break;
    case '/shows.html':
      console.log('tv-shows');
      break;
    case '/movie-details.html':
      console.log('movie-details');
      break;
    case '/tv-details.html':
      console.log('tv-details');
      break;
    case '/search.html':
      console.log('search');
      break;

    default:
      console.log('?');
      break;
  }

  highlightActiveLink();
};

document.addEventListener('DOMContentLoaded', init);
