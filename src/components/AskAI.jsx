import React, { useState } from 'react'
import './AskAI.css'
import Groq from "groq-sdk";
import { Plus, CircleX, Send } from 'lucide-react'
import logo from '../assets/logo.png'



const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;



function AskAI({ addMovieFromSuggest, setshowAI }) {



    const [question, setquestion] = useState("")
    const [result, setresult] = useState(undefined)
    const [message, setmessage] = useState([
        {
            role: "system",
            content: `
You are CineWheel AI.
Recommend exactly 5 movies.
Reply a small message naturally.
Return ONLY JSON.
{
    "reply":"",
    "movies":[
        {
            "title":"",
            "year":0
        }
    ]
}
`
        }
    ])

    const callAI = async () => {
        if(question=="") return

        const updatedMessage = [...message,
        {
            role: "user",
            content: question

        }
        ]
        setmessage(updatedMessage)
        setquestion("")



        const groq = new Groq({ apiKey: GROQ_API_KEY, dangerouslyAllowBrowser: true });
        const getGroqChatCompletion = await groq.chat.completions.create({
            messages: updatedMessage,
            model: "openai/gpt-oss-20b",
        });

        const chatCompletion = await getGroqChatCompletion;

        const reply = chatCompletion.choices[0]?.message?.content || "";

        const replyJSON = JSON.parse(reply)
        const movieRes = replyJSON.movies;
        const movieDetails = await Promise.all(movieRes.map(async (movie) => {
            const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(movie.title)}&year=${movie.year}`);
            const data = await res.json();
            return data.results[0];
        }
        )
        )
        replyJSON.movies = movieDetails
    

        setmessage([...updatedMessage,
        {
            role: "assistant",
            content: JSON.stringify(replyJSON),
        }
        ])

        setquestion("")


    }

    return (
        <div className='chatBotContainer'>


            <div className='chatBot'>
                <CircleX className='circleX' onClick={() => {
                    setshowAI(false)
                }} />
                {message.length === 1 ? (
                    <div className='Reply'>
                        <div className='AIintro' style={{ color: "white" }}>
                            <img src={logo} alt="AI" className='logo' />
                            <h3 id='welcome'>Welcome to</h3>
                            <h1 id='cinewheel'>CineWheel AI</h1>
                            <p>Try saying..</p>
                            <div className="grid">
                                <div className='promptCard'><span className='emoji'>🍿</span> <span className="text">What should I watch after Interstellar?</span></div>
                                <div className='promptCard'><span className='emoji'>🧠</span> <span className="text">Mind-bending movies</span></div>
                                <div className='promptCard'><span className='emoji'>✨</span> <span className="text">Surprise me</span></div>
                                <div className='promptCard'><span className='emoji'>🚀</span> <span className="text">Recommend 5 movies similar to Interstellar, but more emotional.</span></div>
                                <div className='promptCard'><span className='emoji'>❤️</span> <span className="text">Romantic movies with happy endings</span>  </div>
                                <div className='promptCard'><span className='emoji'>⏱️</span> <span className="text">Hidden gems under 2 hours</span></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='Reply'>
                        {message.filter(msg => msg.role !== "system").map((msg, index) => {
                            if (msg.role == "assistant") {
                                const aiMsg = JSON.parse(msg.content)
            
                                return (
                                    <div className="assistantMessage" key={index}>

                                        <div className='logoAndAi'>
                                            <span className='logoSpan'>
                                                <img src={logo} alt="AI" className='logo' />
                                            </span>
                                            <span> CineWheel AI</span>
                                        </div>
                                        <div className={msg.role} key={index}>

                                            {aiMsg.reply}
                                        </div>
                                        <div className='ULcontainer' >
                                            <ul className='moviesUL'>
                                                {aiMsg.movies.map((movie) => (
                                                    <li className='moviesInSuggestion' key={movie.id} >
                                                        <div className='Plus'>
                                                            <Plus
                                                                style={{
                                                                    color: "white",
                                                                    filter:
                                                                        "drop-shadow(0 2px 2px rgba(0,0,0,1)) drop-shadow(0 0 4px rgba(0,0,0,0.9)) drop-shadow(0 0 8px #000000) drop-shadow(0 0 16px #000000)"
                                                                }}

                                                                onClick={() => {
                                                                    addMovieFromSuggest(movie.id);
                                                                }
                                                                }
                                                            />
                                                        </div>
                                                        <div className="suggestionPoster">
                                                            {movie.poster_path ? (
                                                                <img className='suggestionPosterImage' src={`https://image.tmdb.org/t/p/w300${movie?.poster_path}`} alt={movie.title} />
                                                            ) : (<div className="no-poster">No Image Available</div>)
                                                            }
                                                        </div>
                                                        <div className='titleAndYear'>
                                                            <h3 id='movieTitle'>{movie.title || movie.name}</h3>
                                                            <div className='yearAndrating'>
                                                                <h5 id='movieYear'>{(movie.release_date || movie.first_air_date)?.slice(0, 4) || "N/A"}</h5>
                                                                <h5 id='movieRating'>{movie.vote_average.toFixed(2) || "N/A"}</h5>
                                                            </div>

                                                        </div>


                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )
                            }
                            else {
                    

                                return (
                                    <div className={msg.role} key={index}>
                                        {msg.content}
                                    </div>
                                )
                            }
                        }


                        )}
                    </div>
                )}

                <div className='textSubmit'>
                    <input id='inputSearch' type="text" placeholder='Ask a question' value={question} onChange={(e) => {
                        setquestion(e.target.value)
                    }} />
                    <div
                        className="submitBtn"
                        onClick={callAI}
                    >
                        <Send size={20} />
                    </div>
                </div>

            </div>

        </div>
    )
}

export default AskAI
