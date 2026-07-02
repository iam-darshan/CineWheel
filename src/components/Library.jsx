import React,{useState,useEffect} from 'react'
import './Library.css'
import { Trash2 } from 'lucide-react';
import { CircleCheckBig } from 'lucide-react';

const API_KEY = "1a89ea5551c72611dcade6ecf04263ac"

function Library({movies,moviesOfGenre,removeMovie,addToHistory,showPopupDetails}) {

  return (

      <div className="libraryContainer">
        <ul className='library'>
            {movies.map((movie) => (
              <li className='moviesInLibrary' key={movie.id} onClick={()=>{
                showPopupDetails(movie.id); 
              }}>
                <div className="libraryPoster">
                        {movie.poster_path ? (
                        <img className='libraryPosterImage' src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} />
                        ) : (<div className="no-poster">No Image Available</div>)
                    }
                </div>
                <div className='titleAndYear'>
                  <h3 id='movieTitle'>{movie.title}</h3>
                  <h5 id='movieYear'>{movie.release_year || "N/A"}</h5>
                </div>
                <div className='trashContainer'>
                  <div className='addtoLibraryIcon'>
                  <CircleCheckBig onClick={(e)=>{
                    e.stopPropagation();
                    addToHistory(movie.id)
                  }}/>
                  </div>
                  <div className='trashIcon'>
                  <Trash2 onClick={(e)=>{
                    e.stopPropagation();
                  removeMovie(movie.id)
                }}/>
                </div>
                </div>

                
              </li>
            ))}
          </ul>
      </div>

  )
}

export default Library
