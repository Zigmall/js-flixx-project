import TOKEN from './config.js';

const global = {
  currentPage: window.location.pathname
};

const displayPopularMovies = async () => {
  const { results } = await fetchAPIData('/movie/popular');

  results.forEach((element) => {
    const div = document.createElement('div');
    div.classList.add('card');

    div.innerHTML = `
    
    <a href="movie-details.html?id=${element.id}">
      ${
        element.poster_path
          ? `<img
             src="https://image.tmdb.org/t/p/w500${element.poster_path}"
             class="card-img-top"
             alt=${element.title}
           />`
          : `
          <img
          src="images/no-image.jpg"
          class="card-img-top"
          alt=${element.title}
          />
          `
      } 
    </a>
    <div class="card-body">
      <h5 class="card-title">${element.title}</h5>
      <p class="card-text">
        <small class="text-muted">Release: ${element.release_date}</small>
      </p>
    </div>
 
    `;
    document.querySelector('#popular-movies').appendChild(div);
  });
};

const displayPopularTVShows = async () => {
  const { results } = await fetchAPIData('/tv/popular');

  results.forEach((element) => {
    const div = document.createElement('div');
    div.classList.add('card');

    div.innerHTML = `
    
    <a href="movie-details.html?id=${element.id}">
      ${
        element.poster_path
          ? `<img
             src="https://image.tmdb.org/t/p/w500${element.poster_path}"
             class="card-img-top"
             alt=${element.name}
           />`
          : `
          <img
          src="images/no-image.jpg"
          class="card-img-top"
          alt=${element.name}
          />
          `
      } 
    </a>
    <div class="card-body">
      <h5 class="card-title">${element.name}</h5>
      <p class="card-text">
        <small class="text-muted">Air Date: ${element.first_air_date}</small>
      </p>
    </div>
 
    `;
    document.querySelector('#popular-shows').appendChild(div);
  });
};

const displayMovieDetails = async () => {
  const movieId = window.location.search.split('=')[1];

  const movie = await fetchAPIData(`movie/${movieId}`);
  console.log(movie);
  displayMovieBackground('movie', movie.backdrop_path);
  const div = document.createElement('div');
  div.innerHTML = `
      <div class="details-top">
      <div>
      ${
        movie.poster_path
          ? `<img
             src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
             class="card-img-top"
             alt=${movie.title}
           />`
          : `
          <img
          src="images/no-image.jpg"
          class="card-img-top"
          alt=${movie.title}
          />
          `
      } 
      </div>
      <div>
        <h2>${movie.title}</h2>
        <p>
          <i class="fas fa-star text-primary"></i>
          ${movie.vote_average.toFixed(1)} / 10
        </p>
        <p class="text-muted">Release Date: ${movie.release_date}</p>
        <p>
          ${movie.overview}
        </p>
        <h5>Genres</h5>
        <ul class="list-group">
         ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
      
        </ul>
        <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
      </div>
    </div>
    <div class="details-bottom">
      <h2>Movie Info</h2>
      <ul>
        <li><span class="text-secondary">Budget: </span>${addCommasToNumber(movie.budget)}</li>
        <li><span class="text-secondary">Revenue: </span>${addCommasToNumber(movie.revenue)}</li>
        <li><span class="text-secondary">Runtime: </span>${movie.runtime} minutes</li>
        <li><span class="text-secondary">Status: </span> ${movie.status}</li>
      </ul>
      <h4>Production Companies</h4>
      <div class="list-group">${movie.production_companies
        .map((company) => ` <span>${company.name}</span>`)
        .join(',')}</div>
    </div>
  `;

  document.querySelector('#movie-details').appendChild(div);
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
  showSpinner();
  const response = await fetch(`${API_URL}${endpoint}?language=en-UK`, options);
  const data = response.json();
  hideSpinner();
  return data;
};

const showSpinner = () => {
  document.querySelector('.spinner').classList.add('show');
};
const hideSpinner = () => {
  document.querySelector('.spinner').classList.remove('show');
};

const addCommasToNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const displayMovieBackground = (type, backdropPath) => {
  const overlayDiv = document.createElement('div');
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${backdropPath})`
  overlayDiv.style.backgroundSize = 'cover';
  overlayDiv.style.backgroundPosition = 'center';
  overlayDiv.style.backgroundRepeat = 'no-repeat';
  overlayDiv.style.height = '100vh';
  overlayDiv.style.width = '100vw';
  overlayDiv.style.position = 'absolute';
  overlayDiv.style.top = '0';
  overlayDiv.style.left = '0';
  overlayDiv.style.zIndex = '-1';
  overlayDiv.style.opacity = '0.3';

  if (type === 'movie') {
    document.querySelector('#movie-details').appendChild(overlayDiv)
  } else {
    document.querySelector('#tv-details').appendChild(overlayDiv);
  }
}

// Init App
const init = () => {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      displayPopularMovies();
      break;
    case '/shows.html':
      displayPopularTVShows();
      break;
    case '/movie-details.html':
      displayMovieDetails();
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
