import React, { useEffect, useState } from 'react'
import './MovieOfDay.css'
import { Plus } from 'lucide-react';

function MovieOfDay({
    watchedMoviesList,
    movies,
    API_KEY,
    addMovieFromSuggest,
    mediaType,
}) {

    const [topTwomovies, settopTwomovies] = useState([]);
    const [becauseYouWatched, setbecauseYouWatched] = useState("");
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

    const genreToIds = (genres) => {
        return genres
            .map(genre => genreMap[genre])
            .filter(id => id !== undefined);
    };
    const IdtoGenre = (id)=>{
        return Object.keys(genreMap).find(
            key=>genreMap[key] === id
        )
    }

    useEffect(() => {


        const loadTrending = async () => {
            setbecauseYouWatched("");

            const res = await fetch(
                `https://api.themoviedb.org/3/trending/${mediaType}/week?api_key=${API_KEY}`
            );

            const data = await res.json();

            const shuffled = [...data.results].filter(movie=>
                !watchedMoviesList.some(cinema => cinema.id === movie.id)
            ).sort(() => Math.random() - 0.5);

            settopTwomovies(shuffled.slice(0, 2));
        };

        const TodaysPicker = async () => {

            // Watched movies of current media type
            const filteredWatched = watchedMoviesList.filter(
                movie => movie.mediaType === mediaType
            );

            // No watched movies -> Trending
            if (filteredWatched.length === 0) {
                await loadTrending();
                return;
            }

            if (Math.random() < 0.5) {
                await loadTrending();
                return;
            }

            const movie = filteredWatched.at(-1);

            setbecauseYouWatched(movie.title || movie.name);

            const keywordRes = await fetch(
                `https://api.themoviedb.org/3/${mediaType}/${movie.id}/keywords?api_key=${API_KEY}`
            );

            const keywordData = await keywordRes.json();

            const keywordIds =
                mediaType === "movie"
                    ? keywordData.keywords?.map(k => k.id).join("|")
                    : keywordData.results?.map(k => k.id).join("|");

            const genreIds = genreToIds(movie.genres).join(",");

            const res = await fetch(
                `https://api.themoviedb.org/3/discover/${mediaType}?api_key=${API_KEY}&with_keywords=${keywordIds}&with_genres=${genreIds}`
            );

            const data = await res.json();

            const filtered = data.results
                .filter(item =>
                    watchedMoviesList.every(m => m.id !== item.id)
                )
                .filter(item =>
                    movies.every(m => m.id !== item.id)
                );

            if (filtered.length === 0) {
                await loadTrending();
                return;
            }

            const shuffled = [...filtered].sort(() => Math.random() - 0.5);

            settopTwomovies(shuffled.slice(0, 2));
        };

        TodaysPicker();

    }, [mediaType, watchedMoviesList]);

    return (
        <div className='movieOfDayContainer'>
            <h1 className="becauseMovie">
                {becauseYouWatched
                    ? `Because you watched ${becauseYouWatched}`
                    : "✨ Today's Picks"}
            </h1>

            <div className='movieRow'>
                {topTwomovies.map((movie) => (
                    <div className='todaysPicks' key={movie.id}>
                        <div className="pickPoster">
                            <img
                                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                                alt={movie.title || movie.name}
                            />
                        </div>

                        <div className="detailsNew">
                            <div className='titleAndBtn'>
                                <h2>{movie.title || movie.name}</h2>

                                <div
                                    className='addToLibrary'
                                    onClick={() =>
                                        addMovieFromSuggest(movie.id, mediaType)
                                    }
                                >
                                    <Plus />
                                    <div className='addToLibraryBtn'>
                                        Add to Library
                                    </div>
                                </div>
                            </div>

                            <div className="yearAndRatingNew">
                                <div id='releaseYear'>
                                    <h4 id='releaseYearh4'>
                                        {(movie.release_date || movie.first_air_date)?.slice(0, 4) || "N/A"}
                                    </h4>
                                </div>

                                <div id='IMDBrating'>
                                    <h4 id='IMDBratingh4'>
                                        {movie.vote_average?.toFixed(2) || "N/A"}
                                    </h4>
                                </div>
            
                            </div>
                            <div className="genre genreContainer">

                            <h6>Genre</h6>
                            <div className="genreRow scrollableGenre">

                                {movie.genre_ids.map((genre) => (
                                    <div className='genreDiv'>
                                        <h5>{IdtoGenre(genre)}</h5>
                                    </div>
                                ))}
                            </div>

                        </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MovieOfDay;