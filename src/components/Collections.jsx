import React from 'react'
import './Collections.css'
import collections from './CollectionList'
import { Plus, CircleCheckBig } from 'lucide-react'

function Collections({ addMovieFromSuggest, watchedMoviesList, setshowPopup, setselectedMovie, setpopupType }) {
    return (
        <div className='collectionContianer'>
            <div className='collections'>
                <div className="collectionHead">
                    <h4 className='collectionsHeading'>Collection</h4>
                    <p className='headingPara'>A collection for every mood, story, and obsession.</p>
                </div>
                <div className="collectionList">
                    {collections.map((collection) => {
                        const watchedMoviesCount = collection.movies.filter((movie) =>
                            watchedMoviesList.some((watchedMovie) =>
                                watchedMovie.id == movie.id &&
                                watchedMovie.mediaType == movie.mediaType
                            )
                        ).length
                        const collectionCount = collection.movies.length
                        const progress = (watchedMoviesCount / collectionCount) * 100


                        return (
                            <div className="TopIMDBcontainer" >
                                <div className='ListHead'>
                                    <h4 className='collectionTitle'>{collection.title}</h4>
                                    <div className='progress'>{watchedMoviesCount}/{collectionCount}</div>
                                </div>
                                <div className="progressBar">
                                    <div className="progressFill" style={{ width: `${progress}%` }}></div>
                                </div>

                                <div className='movieULcontainer'>
                                    <ul className='moviesUL'>
                                        {collection.movies.map((movie) => {

                                            const isWatched = watchedMoviesList.some((watchedMovie) => {
                                                return watchedMovie.id == movie.id;
                                            })

                                            


                                            return (
                                                <li className='moviesInSuggestion' key={movie.id} onClick={() => {
                                                    setshowPopup(true);
                                                    setpopupType("suggested");
                                                    setselectedMovie(movie.id)
                                                }}>
                                                    {!isWatched ? (<div className='Plus'>
                                                        <Plus
                                                            style={{
                                                                color: "white",
                                                                filter:
                                                                    "drop-shadow(0 2px 2px rgba(0,0,0,1)) drop-shadow(0 0 4px rgba(0,0,0,0.9)) drop-shadow(0 0 8px #000000) drop-shadow(0 0 16px #000000)"
                                                            }}

                                                            onClick={() => {
                                                                addMovieFromSuggest(movie.id, movie.mediaType);
                                                            }
                                                            } />
                                                    </div>) : (

                                                        <div className='tick'>
                                                            <CircleCheckBig style={{
                                                                filter:
                                                                    "drop-shadow(0 2px 2px rgba(0,0,0,1)) drop-shadow(0 0 4px rgba(0,0,0,0.9)) drop-shadow(0 0 8px #000000) drop-shadow(0 0 16px #000000)"
                                                            }} />
                                                        </div>
                                                    )}
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
                                                                <h5 id='movieYear'>{movie.release_year || "N/A"}</h5>
                                                                <h5 id='movieRating'>{movie.rating?.toFixed(2) || "N/A"}</h5>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </li>
                                            )
                                        })}

                                    </ul>
                                </div>
                            </div>
                        )
                    })}

                </div>

            </div>
        </div>
    )
}

export default Collections