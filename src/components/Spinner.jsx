import React, { useEffect, useRef } from 'react'
import './Spinner.css'




function Spinner({movies, moviesOfGenre, rotation, spinWheel, isSpinning }) {
  const canvasRef = useRef(null);


  const center = 200;




  useEffect(() => {


    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const numberSlice = movies.length;

    const arcAngle = Math.PI * 2 / numberSlice;

    const dpi = window.devicePixelRatio || 1;
    canvas.width = 400 * dpi;
    canvas.height = 400 * dpi;
    canvas.style.width = "400px";
    canvas.style.height = "400px";
    ctx.scale(dpi, dpi);
    ctx.clearRect(0, 0, 400, 400);

    if (movies.length === 0) {

      ctx.beginPath();
      ctx.moveTo(center, center)
      ctx.arc(center, center, 200, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(0, 70%, 55%)`;
      ctx.fill();
      ctx.save();
      // ctx.translate("-200px","-800px");
      ctx.textAlign = "center";
      ctx.fillStyle = "white"
      ctx.font = "bold 12px sans-serif"
      ctx.fillText("Add a Movie First", center, 100);

      ctx.restore();
      return
    }


    for (let slice = 0; slice < numberSlice; slice++) {
      ctx.beginPath();
      ctx.moveTo(center, center)
      ctx.arc(center, center, 180, slice * arcAngle, (slice + 1) * arcAngle);
      ctx.closePath();
      const hue = 210 + (slice * 100) / numberSlice;
      ctx.fillStyle = `hsl(${hue}, 55%, 30%)`;

      ctx.shadowColor = "#7C5CFF";
      ctx.shadowBlur = 30;
      ctx.stroke();
      ctx.strokeStyle = "#2415fe";
      ctx.shadowBlur=20;
      ctx.lineWidth = 5;

      ctx.stroke();
      ctx.strokeStyle = "#9f99fb";
       ctx.shadowBlur=40;
      ctx.lineWidth =3;

      ctx.stroke();

      ctx.shadowBlur = 0;

      ctx.fill();

      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(slice * arcAngle + arcAngle / 2);
      ctx.textAlign = "center";
      ctx.fillStyle = "white"
      ctx.font = "bold 11px sans-serif"

      let currentMovie = movies[slice].title
      // let currentMovie=movies[slice]?.title || "";

      if (ctx.measureText(currentMovie).width > 130) {
        while (ctx.measureText(currentMovie + "...").width > 130) {
          currentMovie = currentMovie.slice(0, -1)
        }
        currentMovie = currentMovie + "..."
      }
      ctx.fillText(currentMovie, 110, 5);
      ctx.restore();
    }




  }, [movies])

  return (
    <div className='spinnerBackground'>
      <div className='spinnerContainer'>
        <div className="spinBtnCenter" onClick={spinWheel}>
          SPIN
        </div>
        <div className="pointer"></div>
        <canvas ref={canvasRef} width={400} height={400} style={
          {
            transition: " transform 4s cubic-bezier(0.1, 0.8, 0.3, 1)",
            transform: `rotate(${rotation}deg)`
          }
        }></canvas>
      </div>

      <button type="button" className='spinBtn' onClick={spinWheel} disabled={isSpinning}>{isSpinning ? " Spinning..." : "Spin"}</button>
    </div>
  )
}

export default Spinner
