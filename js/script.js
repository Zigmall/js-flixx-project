import TOKEN from './config.js';

const global = {
  currentPage: window.location.pathname,
  search: {
    term: '',
    type: '',
    page: 1,
    totalPages: 1,
    totalResults: 0
  },
  API_URL: 'https://api.themoviedb.org/3/'
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
    
    <a href="tv-details.html?id=${element.id}">
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

const displayTVShowDetails = async () => {
  const showId = window.location.search.split('=')[1];
  console.log(showId);
  const show = await fetchAPIData(`tv/${showId}`);
  console.log(show);
  displayMovieBackground('tv', show.backdrop_path);
  const div = document.createElement('div');
  div.innerHTML = `
      <div class="details-top">
      <div>
      ${
        show.poster_path
          ? `<img
             src="https://image.tmdb.org/t/p/w500${show.poster_path}"
             class="card-img-top"
             alt=${show.name}
           />`
          : `
          <img
          src="images/no-image.jpg"
          class="card-img-top"
          alt=${show.name}
          />
          `
      } 
      </div>
      <div>
        <h2>${show.name}</h2>
        <p>
          <i class="fas fa-star text-primary"></i>
          ${show.vote_average.toFixed(1)} / 10
        </p>
        <p class="text-muted">Release Date: ${show.release_date}</p>
        <p>
          ${show.overview}
        </p>
        <h5>Genres</h5>
        <ul class="list-group">
         ${show.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
      
        </ul>
        <a href="${show.homepage}" target="_blank" class="btn">Visit Show Homepage</a>
      </div>
    </div>
    <div class="details-bottom">
      <h2>Show Info</h2>
      <ul>
            <li><span class="text-secondary">Number Of Episodes:</span> ${
              show.number_of_episodes
            }</li>
            <li>
              <span class="text-secondary">Last Episode To Air:</span> ${
                show.last_episode_to_air.name
              }
            </li>
            <li><span class="text-secondary">Status:</span> ${show.status}</li>
          </ul>
      <h4>Production Companies</h4>
      <div class="list-group">${show.production_companies
        .map((company) => ` <span>${company.name}</span>`)
        .join(',')}</div>
    </div>
  `;
  document.querySelector('#show-details').appendChild(div);
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
  showSpinner();
  const response = await fetch(`${global.API_URL}${endpoint}?language=en-UK`, options);
  const data = response.json();
  hideSpinner();
  return data;
};

const searchAPIData = async () => {
  showSpinner();
  const response = await fetch(
    `${global.API_URL}search/${global.search.type}?language=en-UK&query=${global.search.term}&page=${global.search.page}`,
    options
  );
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
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${backdropPath})`;
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
    document.querySelector('#movie-details').appendChild(overlayDiv);
  } else if (type === 'tv') {
    document.querySelector('#show-details').appendChild(overlayDiv);
  }
};

const displaySlider = async () => {
  const { results } = await fetchAPIData('movie/now_playing');

  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');
    div.innerHTML = `
      <a href="movie-details.html?id=${movie.id}">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${movie.vote_average} / 10
      </h4>
    `;
    document.querySelector('.swiper-wrapper').appendChild(div);
    initSwiper();
  });
};

const initSwiper = () => {
  const swiper = new Swiper('.swiper', {
    sliderPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false
    },
    breakpoints: {
      500: {
        slidesPerView: 2
      },
      768: {
        slidesPerView: 3
      },
      1024: {
        slidesPerView: 4
      }
    }
  });
};

// Search Movies/TV Shows
const search = async (query) => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  global.search.type = urlParams.get('type');
  global.search.term = urlParams.get('search-term');

  if (global.search.term !== '' && global.search.term !== null) {
    const { results, total_pages, page, total_results } = await searchAPIData();

    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;

    if (results.length === 0) {
      showAlert('No results found', 'error');
      return;
    }
    displaySearchResults(results);
    document.querySelector('#search-term').value = '';
  } else {
    showAlert('Please enter a search term', 'error');
  }
};

const showAlert = (message, className) => {
  const alertElement = document.createElement('div');
  alertElement.classList.add('alert', className);
  alertElement.appendChild(document.createTextNode(message));
  document.querySelector('#alert').appendChild(alertElement);
  setTimeout(() => {
    alertElement.remove();
  }, 3000);
};

const displaySearchResults = (results) => {
  // Clear previous results
  document.querySelector('#search-results').innerHTML = '';
  document.querySelector('#search-results-heading').innerHTML = '';
  document.querySelector('#pagination').innerHTML = '';

  results.forEach((element) => {
    const div = document.createElement('div');
    div.classList.add('card');

    div.innerHTML = `
    
    <a href="${global.search.type}-details.html?id=${element.id}">
      ${
        element.poster_path
          ? `<img
             src="https://image.tmdb.org/t/p/w500${element.poster_path}"
             class="card-img-top"
             alt=${global.search.type === 'movie' ? element.title : element.name}
           />`
          : `
          <img
          src="images/no-image.jpg"
          class="card-img-top"
          alt=${global.search.type === 'movie' ? element.title : element.name}
          />
          `
      } 
    </a>
    <div class="card-body">
      <h5 class="card-title">${global.search.type === 'movie' ? element.title : element.name}</h5>
      <p class="card-text">
        <small class="text-muted">Release: ${
          global.search.type === 'movie' ? element.release_date : element.first_air_date
        }</small>
      </p>
    </div>
 
    `;
    document.querySelector('#search-results-heading').innerHTML = `
        <h2>${results.length} of ${global.search.totalResults}
        Results for ${global.search.term}</h2>
    `;
    document.querySelector('#search-results').appendChild(div);
  });
  displayPagination();
};

const displayPagination = () => {
  const pagination = document.createElement('div');
  pagination.classList.add('pagination');
  pagination.innerHTML = `
  <button class="btn btn-primary" id="prev">Prev</button>
  <button class="btn btn-primary" id="next">Next</button>
  <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
  `;
  document.querySelector('#pagination').appendChild(pagination);

  // Disable prev button on first page
  if (global.search.page === 1) {
    document.querySelector('#prev').disabled = true;
  }

  // Disable next button on last page
  if (global.search.page === global.search.totalPages) {
    document.querySelector('#next').disabled = true;
  }

  // Add event listeners to buttons 
  document.querySelector('#next').addEventListener('click', async () => {
    global.search.page++;
    const { results } = await searchAPIData();
    displaySearchResults(results);
  });

  // Add event listeners to buttons
  document.querySelector('#prev').addEventListener('click', async () => {
    global.search.page--;
    const { results } = await searchAPIData();
    displaySearchResults(results);
  });
};

// Init App
const init = () => {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      displaySlider();
      displayPopularMovies();
      break;
    case '/shows.html':
      displayPopularTVShows();
      break;
    case '/movie-details.html':
      displayMovieDetails();
      break;
    case '/tv-details.html':
      displayTVShowDetails();
      break;
    case '/search.html':
      search();
      break;

    default:
      console.log('?');
      break;
  }

  highlightActiveLink();
};

document.addEventListener('DOMContentLoaded', init);
