import React from 'react'
import './Navbar.css'
import logo from '../assets/logo.png'



function Navbar() {
  return (
    <div className='navbar'>
      <div className='logoAndTitle'>
        <img src={logo} alt="logo" className='logo' />
        <h1>CineWheel</h1>
      </div>
    </div>
  )
}

export default Navbar
