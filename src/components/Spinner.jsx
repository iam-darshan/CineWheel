import React, { useEffect, useRef } from 'react'
import './Spinner.css'




function Spinner({displayedMovies, rotation, spinWheel, isSpinning ,mediaType}) {
  const canvasRef = useRef(null);


  const center = 200;




  useEffect(() => {


    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const numberSlice = displayedMovies.length;

    const arcAngle = Math.PI * 2 / numberSlice;

    const dpi = window.devicePixelRatio || 1;
    canvas.width = 400 * dpi;
    canvas.height = 400 * dpi;
    canvas.style.width = "400px";
    canvas.style.height = "400px";
    ctx.scale(dpi, dpi);
    ctx.clearRect(0, 0, 400, 400);

    if (displayedMovies.length === 0) {

      ctx.beginPath();
      ctx.moveTo(center, center)
      ctx.arc(center, center, 180, 0, Math.PI * 2);
      ctx.closePath();      
      ctx.fillStyle = `hsl(250, 55%, 30%)`;

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
      ctx.textAlign = "center";
      ctx.fillStyle = "white"
      ctx.font = "bold 11px sans-serif"

      ctx.fillText("Add Movie or Change Genre", 0,100);
      ctx.restore();
      return
    }


    for (let slice = 0; slice < numberSlice; slice++) {

   const colors = [
  ["#B15B53", "#88413B"],
  ["#C87A47", "#9F5B31"],
  ["#D0AC56", "#AA8637"],
  ["#9775B2", "#73588F"],
  ["#6072B6", "#42539A"],
  ["#9E4942", "#75312B"],
  ["#3F8A85", "#296B67"],
  ["#6C8C4F", "#4D6A37"],
];

    const startAngle = slice * arcAngle;
    const endAngle = (slice + 1) * arcAngle;

    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, 180, startAngle, endAngle);
    ctx.closePath();

    // -------- Gradient --------

    const gradient = ctx.createRadialGradient(
        center,
        center,
        30,
        center,
        center,
        180
    );

    gradient.addColorStop(0, colors[slice % colors.length][0]);
    gradient.addColorStop(1, colors[slice % colors.length][1]);

    ctx.fillStyle = gradient;
    ctx.fill();

    // -------- Grain --------

    ctx.save();
    ctx.clip();

    for (let i = 0; i < 350; i++) {

        ctx.fillStyle = `rgba(255,255,255,${Math.random()*0.1})`;

        ctx.fillRect(
            center - 180 + Math.random()*360,
            center - 180 + Math.random()*360,
            1,
            1
        );
    }

    ctx.restore();

    // -------- Border --------

    ctx.strokeStyle = "rgba(255,255,255,.18)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // -------- Purple Glow --------

    ctx.save();

    ctx.shadowColor = "#7C5CFF";
    ctx.shadowBlur = 22;

    ctx.strokeStyle = "#6C5CFF";
    ctx.lineWidth = 3;

    ctx.stroke();

    ctx.restore();

    // -------- Text --------

    ctx.save();

    ctx.translate(center, center);
    ctx.rotate(startAngle + arcAngle / 2);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = "white";

    ctx.font = "bold 11px Poppins";

    let currentMovie = displayedMovies[slice].title;

    while (
        ctx.measureText(currentMovie + "...").width > 130 &&
        currentMovie.length > 0
    ) {
        currentMovie = currentMovie.slice(0, -1);
    }

    if (currentMovie !== displayedMovies[slice].title) {
        currentMovie += "...";
    }

    // Small text shadow
    ctx.shadowColor = "rgba(0,0,0,.6)";
    ctx.shadowBlur = 4;

    ctx.fillText(currentMovie, 110, 0);

    ctx.restore();
}




  }, [displayedMovies,rotation])

  useEffect(() => {
  // console.log("Spinner movies:", displayedMovies);
}, [displayedMovies]);

  return (
    <div className='spinnerBackground'>
      <div className="spinnerDetails">
        <h3 className='detailsHeading'>Spin.Discover.Watch</h3>
        <h6 className=''>Add your {mediaType=="movie"? "movies" : "series"} to the library<br></br>
          and let the CineWheel decide.
        </h6>
      </div>
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

      {/* <button type="button" className='spinBtn' onClick={spinWheel} disabled={isSpinning}>{isSpinning ? " Spinning..." : "Spin"}</button> */}
    </div>
  )
}

export default Spinner
