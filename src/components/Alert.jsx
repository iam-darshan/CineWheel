import React from 'react'
import './Alert.css'
import { CircleCheck } from 'lucide-react'

function Alert({alertMsg}) {

    if(alertMsg==""){
        return null;
    }
    else if (alertMsg=="Movie Removed from Library" || alertMsg=="Movie Removed from History" ){
        return(
        <div className='alertContainer red'>
        <CircleCheck />
      <span>{alertMsg}</span>
    </div>)
    }
    else if(alertMsg=="Added to Watched Movies"){
        return(
        <div className='alertContainer green'>
        <CircleCheck />
      <span>{alertMsg}</span>
    </div>)
    }
    else{
    return (
    <div className='alertContainer'>
        <CircleCheck />
      <span>{alertMsg}</span>
    </div>
  )}
}

export default Alert
