import React, { useEffect, useState } from 'react'
import './SuggestedMovies.css'
import { Plus } from 'lucide-react'

function SuggestedMovies({ API_KEY, addMovieFromSuggest, alertFn, mediaType, setshowPopup, setselectedMovie, setpopupType, watchedMoviesList }) {

    const [topMovies, settopMovies] = useState([])
    const [trendingMovies, settrendingMovies] = useState([])
    const [selectedList, setselectedList] = useState("top")

    useEffect(() => {

        const fetchMovies = async () => {

            if (mediaType === "movie") {
                const res1 = await fetch(`https://api.themoviedb.org/3/list/634?api_key=${API_KEY}`);
                const result1 = await res1.json();
                const data1 = result1.items;
                settopMovies(data1);
            }
            if (mediaType === "tv") {
                const res1 = await fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=${API_KEY}`);
                const result1 = await res1.json();
                const data1 = result1.results;
                settopMovies(data1);
            }

            const res2 = await fetch(`https://api.themoviedb.org/3/trending/${mediaType}/week?api_key=${API_KEY}&language=en-US`)
            const result2 = await res2.json();
            const data2 = result2.results;
            settrendingMovies(data2 || []);



        }

        fetchMovies();

    }, [mediaType])

    return (
        <div className='suggestedMoviesContainer'>

            <div className="toggleContainer">
                <div className={`lefttoggle ${selectedList === "top" ? "activetoggleBtn" : "inactivetoggledBtn"}`} onClick={() => {
                    setselectedList("top");
                }}>Top IMDB</div>
                <div className={`righttoggle ${selectedList === "trending" ? "activetoggleBtn" : "inactivetoggledBtn"}`} onClick={() => {
                    setselectedList("trending");
                }}>Trending</div>
            </div>

            <div className={`TopIMDBcontainer ${selectedList === "top" ? "show" : "hide"}`} >
                <h4 className='titleName'>Top IMDB</h4>
                <div className='movieULcontainer' >

                    <ul className='moviesUL'>
                        {topMovies.map((movie) => {
                            const isWatched = watchedMoviesList.some((watchedMovie) => {
                                return watchedMovie.id == movie.id;
                            })

                            return (
                                <li className={`moviesInSuggestion ${isWatched && "isWatchedBorder"}`} key={movie.id} onClick={() => {
                                    setshowPopup(true);
                                    setpopupType("suggested");
                                    setselectedMovie(movie.id)
                                }}>
                                    <div className='Plus'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            addMovieFromSuggest(movie.id, mediaType);
                                        }
                                        }
                                    >
                                        <Plus
                                            style={{
                                                color: "white",
                                                filter:
                                                    "drop-shadow(0 2px 2px rgba(0,0,0,1)) drop-shadow(0 0 4px rgba(0,0,0,0.9)) drop-shadow(0 0 8px #000000) drop-shadow(0 0 16px #000000)"
                                            }}

                                        />
                                    </div>
                                    <div className="suggestionPoster">
                                        {movie.poster_path ? (
                                            <img className='suggestionPosterImage' src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} />
                                        ) : (<div className="no-poster">No Image Available</div>)
                                        }
                                    </div>
                                    <div className='titleAndYear'>
                                        <h3 id='movieTitle'>{movie.title || movie.name}</h3>
                                        <div>
                                            <div className='yearAndrating'>
                                                <h5 id='movieYear'>{movie.release_date?.slice(0, 4) || movie.first_air_date.slice(0, 4) || "N/A"}</h5>
                                                <h5 id='movieRating'>{movie.vote_average.toFixed(2) || "N/A"}</h5>
                                            </div>
                                        </div>
                                    </div>


                                </li>
                            )
                        })}

                    </ul>
                </div>
            </div>
            <div className={`TopIMDBcontainer ${selectedList === "trending" ? "show" : "hide"}`} >
                <h4 className='titleName'>Trending</h4>
                <div className='movieULcontainer'>

                    <ul className='moviesUL'>
                        {trendingMovies.filter(movie => {
                            const date = mediaType === "movie" ? movie.release_date : movie.first_air_date;

                            return new Date(date) <= new Date()

                        }
                        ).map((movie) => {
                            const isWatched = watchedMoviesList.some((watchedMovie) => {
                                return watchedMovie.id == movie.id;
                            })

                            return (
                                <li className={`moviesInSuggestion ${isWatched && "isWatchedBorder"}`} key={movie.id} onClick={() => {
                                    setshowPopup(true);
                                    setselectedMovie(movie.id)
                                }}>
                                    <div className='Plus'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            addMovieFromSuggest(movie.id, mediaType);
                                        }
                                        }
                                    >
                                        <Plus
                                            style={{
                                                color: "white",
                                                filter:
                                                    "drop-shadow(0 2px 2px rgba(0,0,0,1)) drop-shadow(0 0 4px rgba(0,0,0,0.9)) drop-shadow(0 0 8px #000000) drop-shadow(0 0 16px #000000)"
                                            }}

                                        />
                                    </div>
                                    <div className="suggestionPoster">
                                        {movie.poster_path ? (
                                            <img className='suggestionPosterImage' src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} />
                                        ) : (<div className="no-poster">No Image Available</div>)
                                        }
                                    </div>
                                    <div className='titleAndYear yearAndTitle' >
                                        <h3 id='movieTitle'>{movie.title || movie.name}</h3>
                                        <div>
                                            <div className='yearAndrating'>
                                                <h5 id='movieYear'>{movie.release_date?.slice(0, 4) || movie.first_air_date.slice(0, 4) || "N/A"}</h5>
                                                <h5 id='movieRating'>{movie.vote_average.toFixed(2) || "N/A"}</h5>
                                            </div>
                                        </div>
                                    </div>

                                </li>
                            )
                        })}

                    </ul>
                </div>
            </div>
        </div>
    )
}

export default SuggestedMovies
