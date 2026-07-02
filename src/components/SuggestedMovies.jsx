import React,{useEffect,useState} from 'react'
import './SuggestedMovies.css'
import { Plus } from 'lucide-react'

function SuggestedMovies({API_KEY,addMovieFromSuggest,alertFn}) {

    const [topMovies, settopMovies] = useState([])
    const [trendingMovies, settrendingMovies] = useState([])
    const [selectedList, setselectedList] = useState("top")

    useEffect(() => {
        
        const fetchMovies =async () => {
            
                        const res1= await  fetch(`https://api.themoviedb.org/3/list/634?api_key=${API_KEY}`);
                        const result1 = await res1.json();
                        const data1 = result1.items;
                        settopMovies(data1);

                        const res2= await  fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`)
                        const result2 = await res2.json();
                        const data2 = result2.results;
                        console.log(data2)
                        settrendingMovies(data2);

                        
            
        }

        fetchMovies();
    
    }, [])

  return (
    <div className='suggestedMoviesContainer'>

        <div className="toggleContainer">
            <div className={`lefttoggle ${selectedList==="top" ? "activetoggleBtn" : "inactivetoggledBtn"}`} onClick={()=>{
                setselectedList("top");
            }}>Top IMDB</div>
            <div className={`righttoggle ${selectedList==="trending" ? "activetoggleBtn" : "inactivetoggledBtn"}`}  onClick={()=>{
                setselectedList("trending");
            }}>Trending</div>
        </div>

    <div className={`TopIMDBcontainer ${selectedList==="top" ? "show" : "hide"}`} >
        <h4 className='titleName'>Top IMDB</h4>
      <div className='GOATmovies' >
            
            <ul className='topratedUL'>
                {topMovies.map((movie)=>(
                   <li className='moviesInSuggestion' key={movie.id} >
                    <div className="suggestionPoster">
                            {movie.poster_path ? (
                            <img className='suggestionPosterImage' src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} />
                            ) : (<div className="no-poster">No Image Available</div>)
                        }
                    </div>
                    <div className='titleAndYear'>
                      <h3 id='movieTitle'>{movie.title}</h3>
                      <h5 id='movieYear'>{movie.release_date.slice(0, 4) || "N/A"}</h5>
                    </div>
                    <div className='Plus'>
                        <Plus onClick={()=>{
                            addMovieFromSuggest(movie.id);
                            console.log(movie.id);
                        }
                        }/>
                    </div>
            
                  </li>
                ))}
            </ul>
        </div>
      </div>
      <div className={`TopIMDBcontainer ${selectedList==="trending" ? "show" : "hide"}`} >
        <h4 className='titleName'>Trending</h4>
      <div className='GOATmovies'>
            
            <ul className='topratedUL'>
                {trendingMovies.map((movie)=>(
                   <li className='moviesInSuggestion' key={movie.id} >
                    <div className="suggestionPoster">
                            {movie.poster_path ? (
                            <img className='suggestionPosterImage' src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} />
                            ) : (<div className="no-poster">No Image Available</div>)
                        }
                    </div>
                    <div className='titleAndYear'>
                      <h3 id='movieTitle'>{movie.title}</h3>
                      <h5 id='movieYear'>{movie.release_date.slice(0, 4) || "N/A"}</h5>
                    </div>
                    <div className='Plus'>
                        <Plus onClick={()=>{
                            addMovieFromSuggest(movie.id);
                            console.log(movie.id)
                        }
                        }/>
                    </div>
            
                  </li>
                ))}
            </ul>
        </div>
      </div>
    </div>
  )
}

export default SuggestedMovies
