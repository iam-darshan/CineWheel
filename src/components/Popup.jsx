import React, { useState,useEffect } from 'react'
import './Popup.css'
import { CircleX, Trophy,RotateCcw  } from 'lucide-react';

  const API_KEY = "1a89ea5551c72611dcade6ecf04263ac"

function Popup({onClose,selectedMovie,addToHistory,spinWheel,movies}) {

    const [movieDetails, setmovieDetails] = useState(null);

    useEffect(() => {

        const fetchDetails = async () => {
            const movieRes = await fetch(`https://api.themoviedb.org/3/movie/${selectedMovie}?api_key=${API_KEY}`)
            const movieInfo= await movieRes.json();
            setmovieDetails(movieInfo)
            console.log(movieInfo)        
        }

        fetchDetails();
    }, [selectedMovie])

    if (!movieDetails) {
    return <div className="loading">Loading movie data...</div>;
  }
    return (
        <div className='popup'>
            <div className='popupCard'>
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
                    <CircleX onClick={onClose}/>
                </div>
                
                <div className="body">
                    <div className="poster">
                        {movieDetails?.poster_path ? (
                        <img className='posterImage' src={`https://image.tmdb.org/t/p/w300${movieDetails.poster_path}`} alt={movieDetails.title} style={{borderRadius: '20px' }} />
                        ) : (<div className="no-poster">No Image Available</div>)
                    }
                    </div>
                    <div className="details">
                    <h2>{movieDetails.title}</h2>
                    <div className="yearAndRating">
                                <div id='releaseYear'><h4>{movieDetails.release_date.slice(0,4)}</h4></div>
                                <div id='IMDBrating'><h4>{(movieDetails.vote_average).toFixed(2)}</h4></div>
                    </div>
                    <div className="cast">
                        Casting:
                    </div>
                    <div className='desc'>
                       {movieDetails.overview}
                    </div>
                    </div> 
                </div>
                
                <div className="footer">
                    <div className="spinAgain" onClick={()=>{
                        spinWheel();
                        onClose();
                    }}>
                        <RotateCcw  size={40}/>
                        <h4>Spin Again</h4>
                    </div>
                    <div className="addToHistory" onClick={()=>{
                        addToHistory(selectedMovie);
                        onClose();
                    }}>
                        <h4>Watched <br />Add to History</h4>
                    </div>
                </div>
            </div>
        </div>
    )
    
}

export default Popup
