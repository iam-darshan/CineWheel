import React from 'react'
import './Navbar.css'
import logo from '../assets/logo.png'

import { CircleUserRound,LogOut } from 'lucide-react'


function Navbar({userName}) {

  const clearData =()=>{
    localStorage.removeItem("savedMovies");
    localStorage.removeItem("watchedMovies");
  }

  return (
    <div className='navbar'>

      <div className='logoAndTitle'>
        <img src={logo} alt="logo" className='logo' />
        <h1>CineWheel</h1>
      </div>

      <div className="userDetails">
        <CircleUserRound />
        <h5>{userName}</h5>
        <div className='Clear'>
          
        <LogOut onClick={()=>{
          clearData();
          window.location.reload();
        }}/>
        <span className="tooltip">
        Clear Data
    </span>
        </div>
      </div>
    </div>
  )
}

export default Navbar
