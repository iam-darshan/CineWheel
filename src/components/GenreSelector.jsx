import React from 'react'
import './GenreSelector.css'

function GenreSelector({ movies, changeGenre }) {   

const genreList = [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "History",
    "Horror",
    "Music",
    "Mystery",
    "Romance",
    "Science Fiction",
    "Thriller",
    "War"
  ];


    

    return (
        <div className="genreSelection">
            <div>
                <ul className='genreUL'>
                    <li key={"Genre"} onClick={() => {
                            changeGenre("Default");
                        }}>
                        <div className='genrePlate'>Default</div>
                    </li>
                    {genreList.map((genre,index) => (
                        <li key={index}  onClick={() => {
                            changeGenre(genre);
                        }}>
                            <div className='genrePlate'>{genre}</div>

                        </li>)
                    )}

                </ul>
            </div>
        </div>
    )
}

export default GenreSelector
