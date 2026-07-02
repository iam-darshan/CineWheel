import { useState, useEffect, useRef } from 'react'
import './App.css'
import './components/Spinner.css'

import Popup from './components/Popup.jsx'
import Spinner from './components/Spinner.jsx'
import Navbar from './components/Navbar.jsx'
import Library from './components/Library.jsx'
import WatchHistory from './components/WatchHistory.jsx'
import GenreSelector from './components/GenreSelector.jsx'
import SuggestedMovies from './components/SuggestedMovies.jsx'
import Alert from './components/Alert.jsx'
import { AwardIcon } from 'lucide-react'






function App() {
  //clear storage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("reset") === "true") {
        localStorage.clear();
        window.location.href = "/";
    }
}, []);

  const lastList = localStorage.getItem("savedMovies");
  const lastWatchedList = localStorage.getItem("watchedMovies");

  const watchedList = lastWatchedList ? JSON.parse(lastWatchedList) : [];

  const movieList = lastList ? JSON.parse(lastList) : [
    { id: 157336, title: "Interstellar", poster_path: "/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg", release_year: 2014, genres: ["Adventure", "Drama", "Science Fiction"] },
    { id: 27205, title: "Inception", poster_path: "/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg", release_year: 2010, genres: ["Action", "Adventure", "Drama"] }
  ];

  console.log(movieList)


  const [movies, setmovies] = useState(movieList);
  const [watchedMoviesList, setwatchedMoviesList] = useState(watchedList);
  const [rotation, setrotation] = useState(0);
  const [isSpinning, setisSpinning] = useState(false);
  const [showPopup, setshowPopup] = useState(false);
  const [selectedMovie, setselectedMovie] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("Default");
  const [alertMsg, setalertMsg] = useState("");


  const inputRef = useRef();
  const btnRef = useRef();


  const genres = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 10402, name: "Music" },
    { id: 9648, name: "Mystery" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 10770, name: "TV Movie" },
    { id: 53, name: "Thriller" },
    { id: 10752, name: "War" },
    { id: 37, name: "Western" }
  ];

  const genreName = (movieIds)=>{
  return movieIds.map(id=>
    genres.find(genres => genres.id===id)?.name);
  }


  const addMovie = () => {
    const inputValue = inputRef.current.value

    if (inputValue.trim() == "") return;

    const newMovie = { id: Date.now(), title: inputValue.trim() };
    const nextList = [...movies, newMovie];

    setmovies(nextList)
    inputRef.current.value = "";

    let savedMovies = localStorage.setItem("savedMovies", JSON.stringify(nextList))
  }
  const addMovieFromSuggest = async (id) => {
    if (movies.some(movie => movie.id == id)) {
      alertFn("Movie Already Exist in Library");
      return;
    }
    alertFn("Movie Added To Library");
    const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`)
    const result = await res.json();
    const movie = result;
    console.log(movie)
    const newMovie = { id: movie.id, title: movie.title, poster_path: movie.poster_path, release_year: movie.release_date.slice(0, 4), genres: movie.genres.map(genre => genre.name) };
    const newList = [...movies, newMovie];
    setmovies(newList)
    let savedMovies = localStorage.setItem("savedMovies", JSON.stringify(newList))
  }


  const spinWheel = () => {
    if (displayedMovies.length != 0) {
      if (isSpinning) return
      const randomRotation = Math.floor((Math.random() * 3 + 3) * 360)

      setisSpinning(true)
      const constantRotation = rotation + randomRotation;
      setrotation(constantRotation)

      const arcAngle = 360 / displayedMovies.length;
      const movieDegree = (constantRotation % 360);
      const finalAngle = (360 - movieDegree + 270) % 360
      const movieIndex = Math.floor(finalAngle / arcAngle)

      setTimeout(() => {
        setisSpinning(false);
        setshowPopup(true);
        setselectedMovie(displayedMovies[movieIndex].id)
      }, 4000);

    }
  }

  const addToHistory = (movieToRemove) => {
    const newMovieList =
      movies.filter(
        movie => movie.id !== movieToRemove
      )
      ;
    const watchedMovie =
      movies.find(
        movie => movie.id === movieToRemove);
    const newWatchedList = [...watchedMoviesList, watchedMovie];
    setmovies(newMovieList);
    setwatchedMoviesList([...watchedMoviesList, watchedMovie]);
    let watchedMovies = localStorage.setItem("watchedMovies", JSON.stringify(newWatchedList));
    let savedMovies = localStorage.setItem("savedMovies", JSON.stringify(newMovieList));
    alertFn("Added to Watched Movies");

  };

  const removeMovie = (movieToRemove) => {
    const newMovieList =
      movies.filter(
        movie => movie.id !== movieToRemove
      )
      ;
    setmovies(newMovieList)
    let savedMovies = localStorage.setItem("savedMovies", JSON.stringify(newMovieList))
    alertFn("Movie Removed from Library");
  }

  const removeFromHistory = (movieToRemove) => {
    const newWatchedList =
      watchedList.filter(
        movie => movie.id !== movieToRemove
      )
    setwatchedMoviesList(newWatchedList)
    let watchedMovies = localStorage.setItem("watchedMovies", JSON.stringify(newWatchedList));
    alertFn("Movie Removed from Hisory");
  }

  const changeGenre = (genre) => {
    setSelectedGenre(genre)
    console.log("Clicked:", genre);
  }


  const displayedMovies =
    selectedGenre === "Default" ? movies : movies.filter(movie =>
      movie.genres?.includes(selectedGenre)
    )

  const showPopupDetails = (id) => {
    setselectedMovie(id);
    setshowPopup(true);
  }

  const alertFn = (msg) => {
    setalertMsg(msg)
    console.log(msg)
    setTimeout(() => {
      setalertMsg("")
    }, 2000);
  }




  const API_KEY = "1a89ea5551c72611dcade6ecf04263ac"

  return (
    <>
      <div className='container'>
        <Alert alertMsg={alertMsg} />
        <Navbar />
        <GenreSelector movies={movies} changeGenre={changeGenre} />

        <div className='SpinnerLibrarycontainer'>
          <div className='Spinner'>
            <Spinner displayedMovies={displayedMovies} rotation={rotation} spinWheel={spinWheel} isSpinning={isSpinning} />
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
                      if (movies.some(m => m.id == movie.id)) {
                        alertFn("Movie Already Exist in Library");
                        return;
                      }
                      setSuggestions([]);
                      const nextList = [...movies, { id: movie.id, title: movie.title, poster_path: movie.poster_path, release_year: movie.release_date.slice(0, 4),  genres:movie.genres.map(genre=> genre.name) }]
                      setmovies(nextList);

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
                        {console.log(movie)}
                        {movie.title}
                      </div></li>
                  ))}
                </ul>
              )}
            </div>

            <Library movies={displayedMovies} removeMovie={removeMovie} addToHistory={addToHistory} showPopupDetails={showPopupDetails} />

          </div>



        </div>
        <SuggestedMovies API_KEY={API_KEY} addMovieFromSuggest={addMovieFromSuggest} alertFn={alertFn} />
        <WatchHistory watchedMoviesList={watchedMoviesList} removeFromHistory={removeFromHistory} />
      </div>

      {showPopup && <Popup onClose={() => {
        setshowPopup(false)
      }} selectedMovie={selectedMovie} addToHistory={addToHistory} spinWheel={spinWheel} movies={movies} />}
    </>
  )
}

export default App
