import React from 'react'
import './Footer.css'
import logo from '../assets/logo.png'

function Footer() {
  return (
    <div className='footerContainer'>
        <div className='footerTitle'>
            <div className="line"></div>
            <div style={{display:"flex",alignItems:"center",gap:"5px"}}>
             <img src={logo} alt="logo" className='logo footerImg' style={{width:"40px",height:"40px"}} />
            <h1>CineWheel</h1>
            </div>
            <div className="line"></div>
        </div>
        <span>&copy; 2026 CineWheel . All rights reserved.</span>
        <span>Created by Darshan</span>
      
    </div>
  )
}

export default Footer
