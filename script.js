

async function fetchGenres(url) {

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Could not fetch ressource")
        }
        const data = await response.json();
        const genres = data.results.filter(item => item !== null);

        const genreList = genres.map(genre => ({
            name: genre.name,
            value: genre.value
        }));

        return genreList;

    } catch (error) {
        console.error(error);
        return [];
    }
}



async function getMovieUrls(request) {
    try {
        const response = await fetch(request);

        if (!response.ok) {
            throw new Error("Could not fetch resource");
        }

        const data = await response.json();
        const movieUrls = [];


        for (let i = 0; i < data.results.length; i++) {
            const movie = data.results[i];
            movieUrls.push(movie.url);
        }

        return movieUrls;

    } catch (error) {
        console.error(error);
    }
}

async function getMovieDetails(movieUrls) {
    try {
        const movieDetails = [];

        for (let i = 0; i < movieUrls.length; i++) {
            const url = movieUrls[i];

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Could not fetch movie details");
            }

            const details = await response.json();
            movieDetails.push(details);
        }

        return movieDetails;

    } catch (error) {
        console.error(error);
    }
}


async function displaySingleMovie(requestUrl, id) {
    try {
        const movieUrls = await getMovieUrls(requestUrl);
        const firstUrl = [movieUrls[0]];
        const movieDetails = await getMovieDetails(firstUrl);

        const movie = movieDetails[0];
        const imgElement = document.getElementById(id);
        imgElement.src = movie.image_url;
        imgElement.style.display = "inline-block";
        imgElement.style.margin = "10px";
        imgElement.onerror = function () {
            imgElement.src = 'https://m.media-amazon.com/images/M/MV5BNjZhYWVhNjktNDRmNS00NGUyLThjZTgtYmU4NmQzYzIyZTk4XkEyXkFqcGdeQXVyMjkxNzQ1NDI@._V1_UY268_CR0,0,182,268_AL_.jpg';
        };


        document.getElementById("bestmovieDescription").textContent = movie.description;
        document.getElementById("bestmovieName").textContent = movie.title;

    } catch (error) {
        console.error("Error displaying movie:", error);
    }
}


async function displayMoviesImage(requestUrl, id) {

    try {
        const movieUrls = await getMovieUrls(requestUrl);
        const movieDetails = await getMovieDetails(movieUrls);
        const moviesContainer = document.getElementById(id);

        movieDetails.forEach(movie => {

            const imgElement = document.createElement("img");
            imgElement.src = movie.image_url;
            imgElement.style.display = "inline-block";
            imgElement.style.margin = "10px";

            imgElement.onerror = function () {
                imgElement.src = 'https://m.media-amazon.com/images/M/MV5BNjZhYWVhNjktNDRmNS00NGUyLThjZTgtYmU4NmQzYzIyZTk4XkEyXkFqcGdeQXVyMjkxNzQ1NDI@._V1_UY268_CR0,0,182,268_AL_.jpg';
            };
            moviesContainer.appendChild(imgElement);
        });

    } catch (error) {
        console.error("Error fetching or displaying movies:", error);
    }
}

const urltop6movies = "http://localhost:8000/api/v1/titles/?page_size=6&sort_by=-imdb_score"
const urltopmovie = "http://localhost:8000/api/v1/titles/?page_size=1&sort_by=-imdb_score"
const urlgenres = "http://localhost:8000/api/v1/genres/?page_size=50"
const urltop6moviesgenres = "http://localhost:8000/api/v1/titles/?page_size=6&sort_by=-imdb_score&genre="
const urlMystery = "http://localhost:8000/api/v1/titles/?page_size=6&sort_by=-imdb_score&genre=Mystery"



function fillGenreDropdown(genres) {
    const selectElement = document.getElementById('buttoncategory');
    const defaultOption = document.createElement('option');
    defaultOption.textContent = "genres"

    genres.forEach(genre => {
        const option = document.createElement('option');
        option.textContent = genre.name;
        option.value = genre.name;
        selectElement.appendChild(option);
    });
}

fetchGenres(urlgenres).then(genres => {
    console.log(genres);
    fillGenreDropdown(genres);
});

function handleGenreSelection(event) {
    const selectedGenreValue = event.target.name;
    console.log("Selected Genre Value:", selectedGenreValue);

    if (selectedGenreValue) {
        const urlSelectedGenre = `http://localhost:8000/api/v1/titles/?page_size=6&sort_by=-imdb_score&genre=${selectedGenreValue}`;
        displayMoviesImage(urlSelectedGenre, "buttoncategory")
    }
}

displaySingleMovie(urltopmovie, "bestmovieImage")


displayMoviesImage(urltop6movies, "Top6Films")
displayMoviesImage(urlMystery, "Top6Mystery")





// async function fetchTopMovie() {

//     try {


//         const response = await fetch("http://localhost:8000//api/v1/titles/?page_size=1&sort_by=-imdb_score");

//         if (!response.ok) {
//             throw new Error("Could not fetch ressource")
//         }
//         const data = await response.json();

//         const movie = data.results[0];

//         // console.log(data.results[0].id)
//         document.getElementById("bestmovieName").textContent = movie.title;

//         const imgElement = document.getElementById("bestmovieImage");
//         imgElement.src = movie.image_url;
//         imgElement.style.display = "block";

//         const detailsResponse = await fetch(movie.url);

//         if (!detailsResponse.ok) {
//             throw new Error("Could not fetch movie details");
//         }

//         const details = await detailsResponse.json();

//         document.getElementById("movieDescription").textContent = details.description;

//     } catch (error) {
//         console.error(error);
//     }
// }


// async function fetchTop6Movies() {

//     try {


//         const response = await fetch("http://localhost:8000//api/v1/titles/?page_size=6&sort_by=-imdb_score");

//         if (!response.ok) {
//             throw new Error("Could not fetch ressource")
//         }
//         const data = await response.json();

//         for x in data.results:
//             const movie = data.results[x]


//         // console.log(data.results[0].id)
//         document.getElementById("movieName").textContent = movie.title;

//         const imgElement = document.getElementById("topmovieImage");
//         imgElement.src = movie.image_url;
//         imgElement.style.display = "block";

//         const detailsResponse = await fetch(movie.url);

//         if (!detailsResponse.ok) {
//             throw new Error("Could not fetch movie details");
//         }

//         const details = await detailsResponse.json();

//         document.getElementById("movieDescription").textContent = details.description;

//     } catch (error) {
//         console.error(error);
//     }
// }





// fetchTopMovie();

// recuperer meilleur movie
// recupere top 6
// recuperer top 6 d'une catégorie
// récuperer liste catégorie
// récupérer détails d'un film

// async function displaySingleMovieImage(requestUrl, id) {

//     try {
//         const movieUrls = await getMovieUrls(requestUrl);
//         const movieDetails = await getMovieDetails(movieUrls);


//         const moviesContainer = document.getElementById(id);


//         movieDetails.forEach(movie => {
//             const imgElement = document.createElement("img");
//             imgElement.src = movie.image_url;
//             imgElement.style.display = "inline-block";
//             imgElement.style.margin = "10px";
//             imgElement.onerror = function () {
//                 imgElement.src = 'https://m.media-amazon.com/images/M/MV5BNjZhYWVhNjktNDRmNS00NGUyLThjZTgtYmU4NmQzYzIyZTk4XkEyXkFqcGdeQXVyMjkxNzQ1NDI@._V1_UY268_CR0,0,182,268_AL_.jpg';
//             };
//             moviesContainer.appendChild(imgElement);
//         });

//     } catch (error) {
//         console.error("Error fetching or displaying movies:", error);
//     }
// }

// async function getMovieDetails(url) {
//     const detailsResponse = await fetch(url);

//     if (!detailsResponse.ok) {
//         throw new Error("Could not fetch movie details");
//     }

//     const details = await detailsResponse.json();

//     document.getElementById("movieDescription").textContent = details.description;
//     document.getElementById("bestmovieName").textContent = details.title;
// }

