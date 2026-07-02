import React from 'react'
import './GenreSelector.css'

function GenreSelector({ movies, changeGenre }) {

    console.log("GenreSelector rendered");

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
        "TV Movie",
        "Thriller",
        "War"
    ];


    return (
        <div className="genreSelection">
            <div>
                <ul className='genreUL'>
                    <li onClick={() => {
                            changeGenre("Default");
                        }}>
                        <div className='genrePlate'>Default</div>
                    </li>
                    {genreList.map(genre => (
                        <li onClick={() => {
                            changeGenre(genre);
                        }}>
                            <div className='genrePlate'>{genre}</div>

                        </li>)
                    )}

                </ul>
            </div>
            {/* <div>
                Add New
            </div> */}
        </div>
    )
}

export default GenreSelector
