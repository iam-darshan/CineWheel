import React from 'react'
import './WatchHistory.css'
import { Trash2 } from 'lucide-react'

function WatchHistory({watchedMoviesList,removeFromHistory}) {
  return (
    <div className='watchHistoryContainer'>
      <h2 id='heading'>Watched Movies</h2>
      <ul className='hisoryUL'>
          {watchedMoviesList.map((watchedMovie) => (
            <li> 
              <div className='watchedMovieCard'>
                <div className="watchedMoviePoster">
                  <img src={`https://image.tmdb.org/t/p/w300/${watchedMovie.poster_path}`} alt={watchedMovie.title} id='watchedMoviePoster'/>
                </div>
                <div className='titleAndYear'>
                <h3>{watchedMovie.title}</h3>
                <h4>{watchedMovie.release_year}</h4>
                </div>
                <div className='trashIcon'>
                  <Trash2 onClick={()=>{
                    removeFromHistory(watchedMovie.id)
                  }}/>
                </div>
              </div>
            </li>

          ))}
      </ul>
    </div>
  )
}

export default WatchHistory
