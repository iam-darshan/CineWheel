import React, { useState, useEffect } from 'react'
import Spinner from './Spinner';
import './Library.css'
import {Trash2,CircleCheckBig,EllipsisVertical } from 'lucide-react';


const API_KEY = "1a89ea5551c72611dcade6ecf04263ac"

function Library({
  displayedMovies,
  rotation,
  spinWheel,
  isSpinning,
  setselectedMovie,
  setshowPopup,

  inputRef,
  btnRef,
  suggestions,
  setSuggestions,

  movies,
  setmovies,
  addMovie,
  removeMovie,
  addToHistory,
  showPopupDetails,

  API_KEY,
  genreName,
  alertFn,
}) {

  const [menuOpen, setmenuOpen] = useState(null);

  return (
    <div className='libraryContainerMain'>


      <div className='watchHistoryContainer' style={{width:"100%"}}>
        <div>
          <h2 id='heading'>Library</h2>
          <div className='inputAndSubmit'>
            <input type='text' ref={inputRef} placeholder='Search Movies'
              onChange={async (e) => {
                if (!e.target.value) return setSuggestions([]);

                const query = e.target.value;

                const res1 = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=1`);
                const page1 = await res1.json();
                const res2 = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=2`);
                const page2 = await res2.json();
                const res3 = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=3`);
                const page3 = await res3.json();
                const res4 = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=4`);
                const page4 = await res4.json();

                const data = [
                  ...(page1.results || []),
                  ...(page2.results || []),
                  ...(page3.results || []),
                  ...(page4.results || [])
                ]
                const filteredMovie = data.filter(
                  movie =>
                    movie.title.toLowerCase().startsWith(query.toLowerCase())
                )
                const sortedMovie = filteredMovie.sort((a, b) => {
                  return b.popularity - a.popularity
                })
                const top5search = sortedMovie.slice(0, 5);
                setSuggestions(top5search)



              }}
            ></input>


            <button ref={btnRef} onClick={addMovie} >Submit</button>



          </div>
          <div className='movieULcontainer' >



            <ul className='moviesUL'>
              {movies.map((movie) => (
                <div style={{position:"relative"}}>
                <li className='moviesInSuggestion' key={movie.id}  onClick={()=>{
                  setshowPopup(true);
                  setselectedMovie(movie.id)
                }}>
                  <div className='Trash'>
                    <EllipsisVertical className='threeDotIcon'
                      style={{
                        color: "white",
                        filter:
                          "drop-shadow(0 2px 2px rgba(0,0,0,1)) drop-shadow(0 0 4px rgba(0,0,0,0.9)) drop-shadow(0 0 8px #000000) drop-shadow(0 0 16px #000000)"
                      }}

                      onClick={(e) => {
                        e.stopPropagation();
                        if(menuOpen ===movie.id){
                          setmenuOpen(null)
                        }
                        else{

                          setmenuOpen(movie.id)
                        }
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
                    {/* {console.log(movie)} */}
                    <div>
                      <div className='yearAndrating'>
                        <h5 id='movieYear'>{movie.release_year || "N/A"}</h5>
                        {/* <h5 id='movieRating'>{movie.vote_average.toFixed(2) || "N/A"}</h5> */}
                      </div>
                    </div>
                  </div>
                  {menuOpen === movie.id && (
                    <div className='threeDotMenu'>
                    <div className="threeDotBtns" onClick={(e)=>{
                    e.stopPropagation();
                    addToHistory(movie.id)
                  }}>
                      <CircleCheckBig
                      size={15}
                       />
                      <h6>Mark as Watched</h6>
                      </div>
                    <div className="threeDotBtns" onClick={(e) => {
                        e.stopPropagation();
                        removeMovie(movie.id)
                      }
                      }>
                      <Trash2
                      size={15} />
                      <h6>Remove</h6>
                    </div>

                  </div>
                  )}
                  
                  


                </li>
                  </div>
              ))}
            </ul>
          </div>

            

            <div className='suggestionDiv'>
              {suggestions.length > 0 && (

                <ul className='suggestion-dropdown'>
                  {suggestions.map((movie) => (
                    <li className='suggestions' key={movie.id} onClick={() => {
                      
                      if (movies.some(m => m.id == movie.id)) {
                        alertFn("Movie Already Exist in Library");
                        return;
                      }
                      setSuggestions([]);
                      console.log(movie)
                      const nextList = [...movies, { id: movie.id, title: movie.title, poster_path: movie.poster_path, release_year: movie.release_date.slice(0, 4),  genres: genreName(movie.genre_ids) }]
                      setmovies(nextList);

                      inputRef.current.value = ""
                      let savedMovies = localStorage.setItem("savedMovies", JSON.stringify(nextList))


                    }}>

                      <div>
                        {movie.poster_path ? (
                          <div className='libraryPoster'>
                            <img className='libraryPosterImage' src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} />
                          </div>
                        ) : (<div className="no-poster">No Image Available</div>)
                        }
                      </div>
                      <div className='libraryTitleYear'>
                                    <h3 id='LibrarymovieTitle'>{movie.title}</h3>
                                    <div>
                                        <div className='yearAndrating'>
                                            <h5 id='movieYear'>{movie.release_date.slice(0,4) || "N/A"}</h5>
                                            {/* <h5 id id='movieRating'>{movie.vote_average.toFixed(2) || "N/A"}</h5> */}
                                        </div>
                                    </div>
                                </div>
                            
                      </li>
                  ))}
                </ul>
              )}
            </div>

        </div>
      </div>
    </div>
  )
}

export default Library
