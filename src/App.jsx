import { useState, useEffect, useRef, version } from 'react'
import './App.css'
import './components/Spinner.css'

import Popup from './components/Popup.jsx'
import Spinner from './components/Spinner.jsx'
import Navbar from './components/Navbar.jsx'
import Library from './components/Library.jsx'
import WatchHistory from './components/WatchHistory.jsx'
import GenreSelector from './components/GenreSelector.jsx'
import MovieOfDay from './components/MovieOfDay.jsx'
import SuggestedMovies from './components/SuggestedMovies.jsx'
import Alert from './components/Alert.jsx'
import Footer from './components/Footer.jsx'
import AskAI from './components/AskAI.jsx'
<<<<<<< HEAD
=======
import Authentication from './components/Authentication.jsx'
>>>>>>> 40a8bb8 (Firebase in 2nd branch)
import { AwardIcon, Clapperboard, Tv } from 'lucide-react'



import { db } from "./firebase.js";
import { doc, collection, getDoc, getDocs, getFirestore, setDoc, updateDoc, onSnapshot, arrayUnion } from "firebase/firestore";
import { auth } from "./firebase.js";







function App() {
  
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;


  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;


  const STORAGE_VERSION = 4;

  useEffect(() => {
    const savedVersion = Number(localStorage.getItem("storageVersion"))
    if (savedVersion !== STORAGE_VERSION) {
      localStorage.removeItem("savedMovies");
      localStorage.removeItem("watchedMovies");

      localStorage.setItem("storageVersion", STORAGE_VERSION)
    }

  }, [])


  const lastList = localStorage.getItem("savedMovies");
  const lastWatchedList = localStorage.getItem("watchedMovies");

  const watchedList = lastWatchedList ? JSON.parse(lastWatchedList) : [];

  const movieList = lastList ? JSON.parse(lastList) : [];



  const [movies, setmovies] = useState(movieList);
  const [watchedMoviesList, setwatchedMoviesList] = useState(watchedList);
  const [rotation, setrotation] = useState(0);
  const [isSpinning, setisSpinning] = useState(false);
  const [showPopup, setshowPopup] = useState(false);
  const [selectedMovie, setselectedMovie] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("Default");
  const [alertMsg, setalertMsg] = useState("");
  const [mediaType, setmediaType] = useState("movie");
<<<<<<< HEAD
  const [showAI, setshowAI] = useState(false)
  const [userName,setuserName] =useState("Username")
=======
  const [showAI, setshowAI] = useState(false);
  const [userName, setuserName] = useState("Username");

>>>>>>> 40a8bb8 (Firebase in 2nd branch)


  const inputRef = useRef();
  const btnRef = useRef();

  const genreName = (movieIds) => {
    console.log(movieIds)
    return movieIds.map(id =>
      genres.find(genres => genres.id === id)?.name);
  }


  const addMovie = () => {
    const inputValue = inputRef.current.value

    if (inputValue.trim() == "") return;

    const newMovie = { id: "userMovie", title: inputValue.trim() };
    const nextList = [...movies, newMovie];

    setmovies(nextList)
    inputRef.current.value = "";

    let savedMovies = localStorage.setItem("savedMovies", JSON.stringify(nextList))
  }
<<<<<<< HEAD
  const addMovieFromSuggest = async (id,mediaType) => {
=======
  const addMovieFromSuggest = async (id, mediaType) => {
>>>>>>> 40a8bb8 (Firebase in 2nd branch)
    if (movies.some(movie => movie.id == id)) {
      alertFn("Movie Already Exist in Library");
      return;
    }
    alertFn("Movie Added To Library");
    const res = await fetch(`https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${API_KEY}`)
    const result = await res.json();
    const movie = result;
    const newMovie = { id: movie.id, mediaType: mediaType, title: movie.title || movie.name, poster_path: movie.poster_path, release_year: (movie.release_date || movie.first_air_date)?.slice(0, 4), genres: movie.genres.map(genre => genre.name) };

    const newList = [...movies, newMovie];
    setmovies(newList)
    let savedMovies = localStorage.setItem("savedMovies", JSON.stringify(newList))
    const user = auth.currentUser;

     DBupdater({
      library: newList
    })


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

     DBupdater({
      library:newMovieList,
      watchedMovies: newWatchedList
    })


  };

  const removeMovie = (movieToRemove) => {
    const user = auth.currentUser;
    const newMovieList =
      movies.filter(
        movie => movie.id !== movieToRemove)
    setmovies(newMovieList)

    DBupdater({
      library: newMovieList
    })

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

    DBupdater({
      watchedMovies: newWatchedList
    })
  }

  const DBupdater = async (change) => {
    const user = auth.currentUser;

    if (user) {
      await updateDoc(doc(db, "CineWheel", user.uid), change);

    }
  }

  const genres = [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 10759, name: "Action" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" },
    { id: 99, name: "Documentary" },
    { id: 18, name: "Drama" },
    { id: 10751, name: "Family" },
    { id: 14, name: "Fantasy" },
    { id: 10765, name: "Science Fiction" },
    { id: 36, name: "History" },
    { id: 27, name: "Horror" },
    { id: 9648, name: "Mystery" },
    { id: 10402, name: "Music" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
    { id: 53, name: "Thriller" },
    { id: 10770, name: "TV Movie" },
    { id: 10752, name: "War" },
    { id: 10768, name: "War" },
    { id: 37, name: "Western" }
  ];


  const changeGenre = (genre) => {
    setSelectedGenre(genre)
    console.log("Clicked:", genre);
  }

  console.log("movies =", movies);
console.log("typeof movies =", typeof movies);
console.log("isArray =", Array.isArray(movies));

    const displayedMovies = movies.filter(movie =>
      (selectedGenre === "Default" || movie.genres?.includes(selectedGenre)) &&
      movie.mediaType === mediaType
    );

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





  return (
    <>
      <div className='container'>
        <Authentication setuserName={setuserName} setmovies={setmovies} setWatchedMoviesList={setwatchedMoviesList} />
        <Alert alertMsg={alertMsg} />
        <Navbar userName={userName}/>
<<<<<<< HEAD
        <div className='AskAIbtn' onClick={()=>{
          setshowAI(true)
        }}><span>✨ </span>Ask AI</div>
        {showAI && 
        <AskAI addMovieFromSuggest={addMovieFromSuggest} setshowAI={setshowAI} watchedMoviesList={watchedMoviesList} movies={movies}/>
=======
        <div className='AskAIbtn' onClick={() => {
          setshowAI(true)
        }}><span>✨ </span>Ask AI</div>
        {showAI &&
          <AskAI addMovieFromSuggest={addMovieFromSuggest} setshowAI={setshowAI} watchedMoviesList={watchedMoviesList} movies={movies} />
>>>>>>> 40a8bb8 (Firebase in 2nd branch)
        }
        <div className='mediaChange'>
          <div
            className={`mediaChangeBtn ${mediaType === "movie"
              ? "activeMediaChange"
              : "inactiveMediaChange"
              }`}
            onClick={() => {
              setmediaType("movie");
            }}
          >
            <Clapperboard />
            Movie
          </div>

          <div
            className={`mediaChangeBtn ${mediaType === "tv"
              ? "activeMediaChange"
              : "inactiveMediaChange"
              }`}
            onClick={() => {
              setmediaType("tv");
            }}
          >
            <Tv />
            TV Series
          </div>
        </div>
        <div className="genrePlusLibrary">

          <div className='laptopOnly'>
            <GenreSelector movies={movies} changeGenre={changeGenre} />
          </div>


          <div className='SpinnerLibrarycontainer'>

            <div className='Spinner'>

              <Spinner displayedMovies={displayedMovies} rotation={rotation} spinWheel={spinWheel} isSpinning={isSpinning} mediaType={mediaType} />
              <div className='mobileOnly'>
                <GenreSelector movies={movies} changeGenre={changeGenre} />
              </div>
            </div>

            <Library

              displayedMovies={displayedMovies}
              rotation={rotation}
              spinWheel={spinWheel}
              isSpinning={isSpinning}
              setshowPopup={setshowPopup}
              setselectedMovie={setselectedMovie}


              inputRef={inputRef}
              btnRef={btnRef}
              suggestions={suggestions}
              setSuggestions={setSuggestions}

              movies={movies}
              setmovies={setmovies}
              addMovie={addMovie}
              removeMovie={removeMovie}
              addToHistory={addToHistory}
              showPopupDetails={showPopupDetails}
              mediaType={mediaType}


              API_KEY={API_KEY}
              genreName={genreName}
              alertFn={alertFn}
            />


          </div>
        </div>
<<<<<<< HEAD
        <MovieOfDay mediaType={mediaType} watchedMoviesList={watchedMoviesList} movies={movies} addMovieFromSuggest={addMovieFromSuggest} API_KEY={API_KEY} />
=======
        <MovieOfDay mediaType={mediaType} watchedMoviesList={watchedMoviesList} movies={movies} addMovieFromSuggest={addMovieFromSuggest} API_KEY={API_KEY} lastWatchedList={lastWatchedList}/>
>>>>>>> 40a8bb8 (Firebase in 2nd branch)
        <SuggestedMovies API_KEY={API_KEY} addMovieFromSuggest={addMovieFromSuggest} alertFn={alertFn} mediaType={mediaType} />
        <WatchHistory watchedMoviesList={watchedMoviesList} removeFromHistory={removeFromHistory} mediaType={mediaType} />
      </div>

      {showPopup && <Popup onClose={() => {
        setshowPopup(false)
      }} selectedMovie={selectedMovie} addToHistory={addToHistory} spinWheel={spinWheel} movies={movies} mediaType={mediaType} />}

      <Footer />
    </>
  )
}

export default App
