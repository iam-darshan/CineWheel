import React from 'react'
import './Navbar.css'
import logo from '../assets/logo.png'

import { CircleUserRound, LogOut } from 'lucide-react'
import { getAuth, signOut } from "firebase/auth";


function Navbar({userName}) {

  const clearData = () => {

    const auth = getAuth();
    signOut(auth).then(() => {
      console.log("User Signed Out")
    }).catch((error) => {
      console.log(error)
    });

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

          <LogOut onClick={() => {
            clearData();
            window.location.reload();
          }} />
          <span className="tooltip">
            Log Out
          </span>
        </div>
      </div>
    </div>
  )
}

export default Navbar
