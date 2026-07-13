import React, { useState } from 'react'
import './AskAI.css'
import Groq from "groq-sdk";
import { Plus, CircleX, Send } from 'lucide-react'
import logo from '../assets/logo.png'
import ReactMarkdown from "react-markdown";




const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;



function AskAI({ addMovieFromSuggest, setshowAI, watchedMoviesList, movies }) {

    console.log(movies)
    const LibraryMovies = movies.filter(movie => movie.mediaType === "movie").map(movie => ({
        title: movie.title,
        genre: movie.genre

    }))

    const watchedMoviesInfo = watchedMoviesList.filter(movie => movie.mediaType === "movie").map(movie => ({
        title: movie.title,
        genre: movie.genre

    }))

    const [question, setquestion] = useState("")
    const [result, setresult] = useState(undefined)
    const [message, setmessage] = useState([

        {
            role: "system",
            content: `
You are CineWheel AI, a friendly and knowledgeable movie assistant.

Context:

User Library (movies saved to watch):
${JSON.stringify(LibraryMovies)}

User Watched Movies:
${JSON.stringify(watchedMoviesInfo)}

Your responsibilities:

1. Always answer the user's latest message. Do not ignore it because of previous conversation.

2. Always write a natural, conversational reply in the "reply" field.
Never leave the reply empty.

3. Recommend movies only when the user:
- asks for recommendations
- asks what to watch
- mentions a genre, language, country, actor, director, mood, theme, or similar preference
Examples:
- Indian movies
- Korean thrillers
- Funny movies
- Christopher Nolan movies
- Movies like Interstellar
- I want something emotional

4. When recommending:
- Recommend exactly 5 REAL movies.
- Never recommend movies already in the watched list.
- Prefer movies not already in the user's library unless the user specifically asks for movies from their library.
- Mention the watched movies only if it naturally helps explain the recommendations.
- Do not repeatedly mention the watched list.

5. If the user asks about:
- their library
- their saved movies
- their watchlist

Answer ONLY using the provided User Library.

6. If the user asks about:
- watched movies
- movies they have already seen

Answer ONLY using the provided Watched Movies.

7. For general movie questions (actors, directors, plots, awards, genres, etc.), answer using your movie knowledge.

8. If recommendations are not needed, return an empty movies array.

9. If your reply mentions or discusses one or more specific movies, include those movies in the "movies" array whenever possible.

10. If the best answer is a movie that already exists in the user's library, you may recommend that movie instead of avoiding it. Clearly mention that it is already in the user's library.

11. Only avoid recommending watched movies. Movies in the user's library may still be recommended if they are relevant to the user's request.

12. The "movies" array should contain every movie you directly recommend or ask the user to watch. Do not mention a recommended movie in the reply without including it in the "movies" array.

Return ONLY valid JSON in exactly this format:

{
  "reply": "",
  "movies": [
    {
      "title": "",
      "year": 0
    }
  ]
}
`
        }
    ])

    const callAI = async () => {
        if (question == "") return

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
            return data.results[0] ?? null;
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
                                <div className='promptCard' onClick={() => {
                                    setquestion("Mind-bending movies")
                                }}><span className='emoji'>🧠</span> <span className="text">Mind-bending movies</span></div>
                                <div className='promptCard' onClick={() => {
                                    setquestion("Pick a random movie from my library")
                                }}><span className='emoji'>🍿</span> <span className="text">Pick a random movie from my library</span></div>
                                <div className='promptCard' onClick={() => {
                                    setquestion("Surprise me")
                                }}><span className='emoji'>✨</span> <span className="text">Surprise me</span></div>
                                <div className='promptCard' onClick={() => {
                                    setquestion("Recommend 5 movies similar to Interstellar, but more emotional.")
                                }}><span className='emoji'>🚀</span> <span className="text">Recommend 5 movies similar to Interstellar, but more emotional.</span></div>
                                <div className='promptCard' onClick={() => {
                                    setquestion("Romantic movies with happy endings")
                                }}><span className='emoji'>❤️</span> <span className="text">Romantic movies with happy endings</span>  </div>
                                <div className='promptCard' onClick={() => {
                                    setquestion("Hidden gems under 2 hours")
                                }}><span className='emoji'>⏱️</span> <span className="text">Hidden gems under 2 hours</span></div>
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
                                            <ReactMarkdown>
                                                {aiMsg.reply}
                                            </ReactMarkdown>

                                        </div>
                                        {aiMsg.movies.length !== 0 &&
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
                                        }
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
                    }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                callAI();
                            }
                        }}
                    />
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
