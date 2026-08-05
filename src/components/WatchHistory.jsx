import React from 'react'
import './WatchHistory.css'
import { Trash2,Clapperboard,Tv } from 'lucide-react'

function WatchHistory({ watchedMoviesList, removeFromHistory, mediaType }) {
    return (
        <div className='watchHistoryContainer'>
            <div className='titleAndCount'>
                <h2 id='heading'>Watched {mediaType == "movie" ? "Movies" : "Series"}</h2>
                <div className='countBox'>
                    {mediaType==="movie" ? <Clapperboard /> : <Tv />}
                    <span className="badgeCount">{watchedMoviesList.filter(movie=> movie.mediaType === mediaType).length}</span>
                    <span className='countBoxLabel'> watched</span>
                </div>
            </div>
            <div className='movieULcontainer' >

                <ul className='moviesUL'>
                    {watchedMoviesList.slice().reverse().filter(movie => movie.mediaType === mediaType).map((movie) => (
                        <li className='moviesInSuggestion' key={movie.id} >
                            <div className='Trash'>
                                <Trash2 className='trashIcon'
                                    style={{
                                        color: "white",
                                        filter:
                                            "drop-shadow(0 2px 2px rgba(0,0,0,1)) drop-shadow(0 0 4px rgba(0,0,0,0.9)) drop-shadow(0 0 8px #000000) drop-shadow(0 0 16px #000000)"
                                    }}

                                    onClick={() => {
                                        removeFromHistory(movie.id);
                                    }
                                    } />
                            </div>
                            <div className="suggestionPoster">
                                {movie.poster_path ? (
                                    <img className='suggestionPosterImage' src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} />
                                ) : (<div className="no-poster">No Image Available</div>)
                                }
                            </div>
                            <div className='titleAndYear'>
                                <h3 id='movieTitle'>{movie.title}</h3>

                                <div>
                                    <div className='yearAndrating'>
                                        <h5 id='movieYear'>{movie.release_year || "N/A"}</h5>
                                        {/* <h5 id='movieRating'>{movie.vote_average.toFixed(2) || "N/A"}</h5> */}
                                    </div>
                                </div>
                            </div>


                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default WatchHistory
