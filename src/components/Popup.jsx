import React, { useState, useEffect } from 'react'
import './Popup.css'
import { CircleX, Trophy, RotateCcw } from 'lucide-react';

const API_KEY = "1a89ea5551c72611dcade6ecf04263ac"

function Popup({ onClose, selectedMovie, addToHistory, spinWheel, movies, mediaType }) {

    const [movieDetails, setmovieDetails] = useState(null);
    const [movieCreditDetails, setmovieCreditDetails] = useState();
    const [movieProvidersDetails, setmovieProvidersDetails] = useState();

    useEffect(() => {

    if (selectedMovie === "userMovie") return;

    const fetchDetails = async () => {

        try {

            const [movieRes, providersRes, creditsRes] = await Promise.all([
                fetch(`https://api.themoviedb.org/3/${mediaType}/${selectedMovie}?api_key=${API_KEY}`),
                fetch(`https://api.themoviedb.org/3/${mediaType}/${selectedMovie}/watch/providers?api_key=${API_KEY}`),
                fetch(`https://api.themoviedb.org/3/${mediaType}/${selectedMovie}/credits?api_key=${API_KEY}`)
            ]);

            const movieInfo = await movieRes.json();
            const providersData = await providersRes.json();
            const creditsData = await creditsRes.json();

            setmovieDetails(movieInfo);

            setmovieProvidersDetails(
                providersData.results?.IN?.flatrate || []
            );

            setmovieCreditDetails(creditsData);

        } catch (error) {
            console.error("Failed to fetch movie details:", error);
        }

    };

    fetchDetails();

}, [selectedMovie]);

    if (!movieDetails) {
        return <div className="loading">Loading movie data...</div>;
    }
    return (
        <div className='popup'>
            <div className='popupCard'>
                <div className="backdropContainer">
                    <img
                        src={`https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}`}
                        className="backdropImage"
                        alt=""
                    />
                    <div className="backdropOverlay"></div>
                </div>
                <div className="header">
                    <div className='todayspick'>
                        <Trophy size={30}
                            style={{
                                color: "#ffffff",
                                filter: "drop-shadow(0 0 6px #00d97a)"
                            }}
                        />
                        <h2>Tonight's Pick</h2>
                    </div>
                    <CircleX onClick={onClose} />
                </div>

                <div className="body">

                    <div className="poster">
                        {movieDetails?.poster_path ? (
                            <img className='posterImage' src={`https://image.tmdb.org/t/p/w300${movieDetails.poster_path}`} alt={movieDetails.title} style={{ borderRadius: '20px' }} />
                        ) : (<div className="no-poster">No Image Available</div>)
                        }
                    </div>
                    <div className="details">
                        <h2>{movieDetails.title || movieDetails.name}</h2>
                        <div className="yearAndRating">
                            <div id='releaseYear'><h4 id='releaseYearh4'>{(movieDetails.release_date || movieDetails.first_air_date)? (movieDetails.release_date || movieDetails.first_air_date).slice(0, 4) : "N/A"}</h4></div>
                            <div id='IMDBrating'><h4 id='IMDBratingh4'>{movieDetails.vote_average?(movieDetails.vote_average).toFixed(2) : "N/A"}</h4></div>
                            <div className='runTime'><span>{movieDetails.runtime}</span><span>min</span></div>
                        </div>
                        <div>
                            <span>Directed by </span>
                            <span>{movieCreditDetails?.crew?.find(
                                person => person.job ==="Director"
                            )?.name}</span>
                        
                        </div>
                        <div className="genre">
                            
                            <h6>Genre</h6>
                            <div className="genreRow">

                           {movieDetails.genres.map((genre)=>(
                               <div className='genreDiv'>
                                <h5>{genre.name}</h5>
                                </div>
                           ))}
                           </div>
                            
                        </div>
                        <div className='desc'>
                            <h6>Overview</h6>
                            <h5>
                                {movieDetails.overview}
                            </h5>
                        </div>
                        {movieProvidersDetails &&
                        <div className="watchProviders">
                            <h3>Included with Subscription</h3>
                            <div className="providersRow">
                                {movieProvidersDetails.map((provider) => (
                                    <div className="providerCard"
                                     key={provider.provider_id}
                                     >
                                        
                                        <img src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                                            alt={provider.provider_name}
                                            title={provider.provider_name} />
                                          <span>{provider.provider_name}</span>  
                                    </div>
                                ))}
                            </div>
                        </div>
                        }
                        <div className="cast">
                            <h3>Cast</h3>
                            <div className="castRow">
                                {
                                    movieCreditDetails.cast.slice(0,4).map((actor)=>(
                                        <div className="castCard" key={actor.id}>
                                            <div className='castImg'>

                                            <img  src={`https://image.tmdb.org/t/p/w92${actor.profile_path}`}
                                            // alt={provider.provider_name}
                                            title={actor.name} 
                                            />
                                            </div>
                                        <h6 className='actorName'>{actor.name}</h6>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>


                    </div>
                </div>

                <div className="footer">
                    <div className="spinAgain" onClick={() => {
                        spinWheel();
                        onClose();
                    }}>
                        <RotateCcw size={40} />
                        <h4 id='spinAgainh4'>Spin Again</h4>
                    </div>
                    <div className="addToHistory" onClick={() => {
                        addToHistory(selectedMovie);
                        onClose();
                    }}>
                        <h4 id='addToHistoryh4'>Watched <br />Add to History</h4>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Popup
