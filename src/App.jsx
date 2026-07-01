import { useState, useEffect, useRef } from 'react'
import './App.css'
import './components/Spinner.css'

import Popup from './components/Popup.jsx'
import Spinner from './components/Spinner.jsx'
import Navbar from './components/Navbar.jsx'
import Library from './components/Library.jsx'
import WatchHistory from './components/WatchHistory.jsx'
import { AwardIcon } from 'lucide-react'




function App() {

  const inputRef = useRef();
  const btnRef = useRef();

  const lastList = localStorage.getItem("savedMovies");
  const lastWatchedList =localStorage.getItem("watchedMovies");
  const watchedList = lastWatchedList
  ? JSON.parse(lastWatchedList)
  : [];


  const movieList = lastList ? JSON.parse(lastList) : [
    { id: 157336, title: "Interstellar", poster_path: "/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg", release_year: 2014 },
    { id: 27205, title: "Inception", poster_path: "/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg", release_year: 2010 }
  ];


  const [movies, setmovies] = useState(movieList);
  const [watchedMoviesList, setwatchedMoviesList] = useState(watchedList)



  const addMovie = () => {
    const inputValue = inputRef.current.value

    if (inputValue.trim() == "") return;

    const newMovie = { id: Date.now(), title: inputValue.trim() };
    const nextList = [...movies, newMovie];

    setmovies(nextList)
    inputRef.current.value = "";

    let savedMovies = localStorage.setItem("savedMovies", JSON.stringify(nextList))
  }

  const spinWheel = () => {
    if (movies.length != 0) {
      if (isSpinning) return
      const randomRotation = Math.floor((Math.random() * 3 + 3) * 360)

      setisSpinning(true)
      const constantRotation = rotation + randomRotation;
      setrotation(constantRotation)

      const arcAngle = 360 / movies.length;
      const movieDegree = (constantRotation % 360);
      const finalAngle = (360 - movieDegree + 270) % 360
      const movieIndex = Math.floor(finalAngle / arcAngle)

      setTimeout(() => {
        setisSpinning(false);
        console.log(rotation);
        setshowPopup(true);
        setselectedMovie(movies[movieIndex].id)
      }, 4000);

    }
  }

  const addToHistory = (movieToRemove) => {
    const newMovieList =
      movies.filter(
        movie => movie.id !== movieToRemove
      )
      ;
    const watchedMovie=
      movies.find(
        movie=> movie.id === movieToRemove);
    const newWatchedList =[...watchedMoviesList,watchedMovie];
    setmovies(newMovieList);
    setwatchedMoviesList([...watchedMoviesList,watchedMovie]);
    let watchedMovies = localStorage.setItem("watchedMovies", JSON.stringify(newWatchedList));
    let savedMovies = localStorage.setItem("savedMovies", JSON.stringify(newMovieList));

  };

  const removeMovie = (movieToRemove) => {
    const newMovieList =
      movies.filter(
        movie => movie.id !== movieToRemove
      )
      ;
    setmovies(newMovieList)
    let savedMovies = localStorage.setItem("savedMovies", JSON.stringify(newMovieList))
  }

  const removeFromHistory =(movieToRemove)=>{
    const newWatchedList =
    watchedList.filter(
      movie => movie.id !== movieToRemove
    )
    setwatchedMoviesList(newWatchedList)
    let watchedMovies = localStorage.setItem("watchedMovies", JSON.stringify(newWatchedList));
  }

  const [rotation, setrotation] = useState(0);
  const [isSpinning, setisSpinning] = useState(false);
  const [showPopup, setshowPopup] = useState(false);
  const [selectedMovie, setselectedMovie] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  

  const API_KEY = "1a89ea5551c72611dcade6ecf04263ac"

  return (
    <>
      <div className='container'>
        <Navbar />
        <div className='SpinnerLibrarycontainer'>
          <div className='Spinner'>
            <Spinner movies={movies} rotation={rotation} spinWheel={spinWheel} isSpinning={isSpinning} />
          </div>



          <div className='inputLibraryContainer'>
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
                      movie.original_language === "en" &&
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

            <div className='suggestionDiv'>
              {suggestions.length > 0 && (

                <ul className='suggestion-dropdown'>
                  {suggestions.map((movie) => (
                    <li className='suggestions' key={movie.id} onClick={() => {
                      const nextList = [...movies, { id: movie.id, title: movie.title, poster_path: movie.poster_path, release_year: movie.release_date.slice(0, 4) }]
                      setmovies(nextList);
                      setSuggestions([]);
                      inputRef.current.value = ""
                      let savedMovies = localStorage.setItem("savedMovies", JSON.stringify(nextList))

                    }}>

                      <div className="poster">
                        {movie.poster_path ? (
                          <img className='posterImage' src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} style={{ borderRadius: '20px' }} />
                        ) : (<div className="no-poster">No Image Available</div>)
                        }
                      </div>
                      <div>
                        {movie.title}
                      </div></li>
                  ))}
                </ul>
              )}
            </div>

            <Library movies={movies} removeMovie={removeMovie} addToHistory={addToHistory}/>

          </div>



        </div>
        <WatchHistory watchedMoviesList={watchedMoviesList} removeFromHistory={removeFromHistory}/>
      </div>

      {showPopup && <Popup onClose={() => {
        setshowPopup(false)
      }} selectedMovie={selectedMovie} addToHistory={addToHistory} spinWheel={spinWheel} movies={movies} />}
    </>
  )
}

export default App
