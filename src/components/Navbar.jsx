import React from 'react'
import './Navbar.css'
import logo from '../assets/logo.png'

import { CircleUserRound,LogOut } from 'lucide-react'


function Navbar() {
  return (
    <div className='navbar'>

      <div className='logoAndTitle'>
        <img src={logo} alt="logo" className='logo' />
        <h1>CineWheel</h1>
      </div>

      <div className="userDetails">
        <CircleUserRound />
        <h5>UserName</h5>
        <LogOut />
      </div>
    </div>
  )
}

export default Navbar
