import React, { useEffect, useState } from 'react'
import './MovieOfDay.css'
import { Plus } from 'lucide-react';

function MovieOfDay({ watchedMoviesList, movies, API_KEY, addMovieFromSuggest }) {

    const [topTwomovies, settopTwomovies] = useState([])
    const [becauseYouWatched, setbecauseYouWatched] = useState("")


    useEffect(() => {

        const TodaysPicker = async () => {
            if (watchedMoviesList.length === 0) {
                setbecauseYouWatched("");
                const res = await fetch(
                    `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`
                );
                const data = await res.json();
                const shuffled = [...data.results].sort(() => Math.random() - 0.5);
                settopTwomovies(shuffled.slice(0, 2));

                return;
            }

            const movie = watchedMoviesList.at(-1);
            setbecauseYouWatched(movie.title)
            const movieId = movie.id;

            const keywordRes = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/keywords?api_key=${API_KEY}`)
            const keywordData = await keywordRes.json();
            const keywordIds = keywordData.keywords.map(key => key.id).join("|")
            const ids = genreToIds(movie.genres).join(",")

            const res = await fetch(
                `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_keywords=${keywordIds}&with_genres=${ids}`
            );

            const data = await res.json();
            const result = data.results;
            const notInWatched = result.filter(movie => watchedMoviesList.every(m => m.id !== movie.id))
            const notInLibrary = notInWatched.filter(movie => movies.every(m => m.id !== movie.id))
            const sortedList = notInLibrary.sort((a, b) => b.vote_rating - a.vote_rating)

            const topTwo = sortedList.slice(0, 2);
            settopTwomovies(topTwo)

        }

        const genreToIds = (genres) => {
            return genres.map(genre => genreMap[genre]).filter(id => id !== undefined)
        }

        const genreMap = {
            "Action": 28,
            "Adventure": 12,
            "Animation": 16,
            "Comedy": 35,
            "Crime": 80,
            "Documentary": 99,
            "Drama": 18,
            "Family": 10751,
            "Fantasy": 14,
            "History": 36,
            "Horror": 27,
            "Music": 10402,
            "Mystery": 9648,
            "Romance": 10749,
            "Science Fiction": 878,
            "TV Movie": 10770,
            "Thriller": 53,
            "War": 10752,
            "Western": 37
        };

        TodaysPicker()
    }, [])

    return (

        <div className='movieOfDayContainer'>
            <h1 className="becauseMovie">
                {becauseYouWatched
                    ? `Because you watched ${becauseYouWatched}`
                    : "✨ Today's Picks"}
            </h1>           <div className='movieRow'>
                {topTwomovies.map((movie, index) => (
                    <div className='todaysPicks' key={index}>
                        <div className="pickPoster">
                            <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} />
                        </div>
                        <div className="detailsNew">
                            <div className='titleAndBtn'>
                                <h2>{movie.title || movie.name}</h2>
                                <div className='addToLibrary' onClick={() => {
                                    addMovieFromSuggest(movie.id)
                                }}>
                                    <Plus />
                                    <div className='addToLibraryBtn'>Add to Library</div>
                                </div>
                            </div>
                            <div className="yearAndRatingNew">
                                <div id='releaseYear'><h4 id='releaseYearh4'>{(movie.release_date || movieDetails.first_air_date) ? (movie.release_date || movie.first_air_date).slice(0, 4) : "N/A"}</h4></div>
                                <div id='IMDBrating'><h4 id='IMDBratingh4'>{movie.vote_average ? (movie.vote_average).toFixed(2) : "N/A"}</h4></div>
                                {/* <div className='runTime'><span>{movie.runtime}</span><span>min</span></div> */}
                            </div>
                            <div className='desc'>
                                <h6>Overview</h6>
                                <h5>
                                    {movie.overview}
                                </h5>
                            </div>
                        </div>


                    </div>
                ))}


            </div>
        </div>
    )
}

export default MovieOfDay
