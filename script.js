const baseUrl = "http://localhost:8000/api/v1/"



function generateUrl({ endpoint, pageSize = 6, sortBy = '', genre = '' }) {
    const params = new URLSearchParams();

    params.append('page_size', pageSize);

    if (sortBy) {
        params.append('sort_by', sortBy);
    }

    if (genre) {
        params.append('genre', genre);
    }

    return `${baseUrl}${endpoint}?${params.toString()}`;
}

const urlgenres = generateUrl({
    endpoint: "genres/",
    pageSize: 50
});

async function fetchGenres(urlgenres) {
    const response = await fetch(urlgenres);
    if (!response.ok) {
        console.error("Error fetching genres");
        return [];
    }
    const data = await response.json();

    return data.results.map(genre => ({
        name: genre.name,
        value: genre.value
    }));
}


async function getMovieUrls(genre) {
    const url = generateUrl({
        endpoint: "titles/",
        pageSize: 6,
        sortBy: "-imdb_score",
        genre: genre
    });
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Could not fetch resource");
    }

    const data = await response.json();
    const movieUrls = data.results.map(movie => movie.url)

    return movieUrls;

}


async function getTopMovieUrl() {
    const url = generateUrl({
        endpoint: "titles/",
        pageSize: 1,
        sortBy: "-imdb_score",
    });
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Could not fetch resource");
    }

    const data = await response.json();

    const movieUrl = data.results[0].url

    return movieUrl;
}

async function getMovieDetails(movieUrl) {
    const response = await fetch(movieUrl);

    if (!response.ok) {
        throw new Error("Could not fetch movie details");
    }

    const details = await response.json();
    return details;
}

function displayMovieImage(movie, containerId) {
    const container = document.getElementById(containerId);

    const movieBox = document.createElement("div");
    movieBox.classList.add("movie-box-wrapper");
    movieBox.movieDetails = movie;

    const imgElement = document.createElement("img");
    imgElement.src = movie.image_url;
    imgElement.classList.add("box");
    imgElement.onerror = function () {
        imgElement.src = 'https://m.media-amazon.com/images/M/MV5BNjZhYWVhNjktNDRmNS00NGUyLThjZTgtYmU4NmQzYzIyZTk4XkEyXkFqcGdeQXVyMjkxNzQ1NDI@._V1_UY268_CR0,0,182,268_AL_.jpg';
    };

    imgElement.addEventListener('click', function () {
        openModal(movie);
    });

    movieBox.appendChild(imgElement);
    container.insertBefore(movieBox, container.firstChild);

    return movieBox;
}



function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}

function openModal(movie) {
    const modal = document.getElementById("modal");
    const modalContent = document.querySelector(".modal-content");

    modalContent.innerHTML = '';

    const movieTitle = document.createElement("h2");
    movieTitle.textContent = movie.title;

    const yearAndGenres = document.createElement("p");
    yearAndGenres.textContent = `${movie.year} - ${movie.genres.join(", ")}`;

    const ageDurationAndOrigin = document.createElement("p");
    ageDurationAndOrigin.textContent = `${movie.rated} - ${movie.duration} minutes (${movie.countries.join(", ")})`;

    const imdbScore = document.createElement("p");
    imdbScore.textContent = `IMDB score: ${movie.imdb_score}/10`;

    const boxOffice = document.createElement("p");
    if (movie.budget) {
        boxOffice.textContent = `Recettes au box-office: $${movie.budget.toLocaleString()}`;
    } else {
        boxOffice.textContent = `Budget: `;
    }

    const directorSection = document.createElement("p");
    directorSection.textContent = `Réalisé par: ${movie.directors.join(", ")}`;

    const movieDescription = document.createElement("p");
    movieDescription.textContent = `${movie.description}`;

    const actorsSection = document.createElement("p");
    actorsSection.textContent = `Avec: ${movie.actors.join(", ")}`;

    const movieImage = document.createElement("img");
    movieImage.src = movie.image_url;
    movieImage.alt = `Image for ${movie.title}`;
    movieImage.classList.add("modal-image");
    movieImage.onerror = function () {
        movieImage.src = 'https://m.media-amazon.com/images/M/MV5BNjZhYWVhNjktNDRmNS00NGUyLThjZTgtYmU4NmQzYzIyZTk4XkEyXkFqcGdeQXVyMjkxNzQ1NDI@._V1_UY268_CR0,0,182,268_AL_.jpg';
    };

    const fermerButton = document.createElement("button");
    fermerButton.textContent = "Fermer";
    fermerButton.id = "fermerModalBtn";
    fermerButton.onclick = function () {
        closeModal();
    };
    [
        movieImage,
        movieTitle,
        yearAndGenres,
        ageDurationAndOrigin,
        imdbScore,
        boxOffice,
        directorSection,
        movieDescription,
        actorsSection,
        fermerButton
    ].forEach(element => modalContent.appendChild(element));

    const closeModalButton = document.getElementById("fermerModalBtn");
    closeModalButton.onclick = closeModal;

    modal.style.display = "block";

}

async function addOverlay(movieBox) {
    const movie = movieBox.movieDetails;
    const overlay = document.createElement("div");
    overlay.id = "movie-overlay";

    const titleMovie = document.createElement("p");
    titleMovie.textContent = movie.title;
    titleMovie.id = "movieTitleBox";

    const detailButton = document.createElement("button");
    detailButton.id = "DetailModalBtn";
    detailButton.textContent = "Détails";
    detailButton.onclick = function () {
        openModal(movie);
    };

    overlay.appendChild(titleMovie);
    overlay.appendChild(detailButton);

    movieBox.appendChild(overlay);
}

async function displayBestMovie(containerId) {
    const movieUrl = await getTopMovieUrl()
    const movieDetails = await getMovieDetails(movieUrl);
    displayMovieImage(movieDetails, containerId);
    const imgElement = document.querySelector(`#${containerId} img`);
    document.getElementById("bestmovieName").textContent = movieDetails.title;
    document.getElementById("bestmovieDescription").textContent = movieDetails.description;

    const button = document.getElementById('bestMovieButton');

    button.addEventListener('click', function () {
        openModal(movieDetails);
    });


}

async function displayTop6Movies(genre, containerId) {
    const movieUrls = await getMovieUrls(genre);
    const container = document.getElementById(containerId)
    container.innerHTML = ""
    for (const url of movieUrls) {
        const movieDetails = await getMovieDetails(url);
        const movieBoxElement = displayMovieImage(movieDetails, containerId);

        movieBoxElement.classList.add("top-6"); //TODO à mettre dans displayimage selon param
        addOverlay(movieBoxElement);
    }
}


function fillGenreDropdown(genres, containerId, selectId) {
    const selectElement = document.getElementById(selectId);

    genres.forEach(genre => {
        const option = document.createElement('option');
        option.textContent = genre.name;
        option.value = genre.name;
        selectElement.appendChild(option);
    });

    selectElement.addEventListener('change', function (event) {
        handleGenreSelection(event, containerId);
    });
}

function handleGenreSelection(event, containerId) {
    const selectedGenreValue = event.target.value;
    if (selectedGenreValue) {
        displayTop6Movies(selectedGenreValue, containerId);
    }
}

fetchGenres(urlgenres).then(genres => {
    fillGenreDropdown(genres, "genreMovies", "buttoncategory");
});

fetchGenres(urlgenres).then(genres => {
    fillGenreDropdown(genres, "genreMovies2", "buttoncategory2");
});



displayBestMovie("bestMovie");
displayTop6Movies("mystery", "Top6Mystery")
displayTop6Movies("romance", "Top6Romance")
displayTop6Movies("", "Top6Films")
