import React from 'react'
import './Quotes.css'
import { Quote } from 'lucide-react'


function Quotes() {
  const quotes = [
  {
    dialogue: "Why so serious?",
    character: "The Joker",
    movie: "The Dark Knight"
  },
  {
    dialogue: "May the Force be with you.",
    character: "Han Solo",
    movie: "Star Wars"
  },
  {
    dialogue: "I'll be back.",
    character: "The Terminator",
    movie: "The Terminator"
  },
  {
    dialogue: "Hasta la vista, baby.",
    character: "The Terminator",
    movie: "Terminator 2: Judgment Day"
  },
  {
    dialogue: "With great power comes great responsibility.",
    character: "Uncle Ben",
    movie: "Spider-Man"
  },
  {
    dialogue: "I am Iron Man.",
    character: "Tony Stark",
    movie: "Iron Man"
  },
  {
    dialogue: "Avengers... Assemble!",
    character: "Captain America",
    movie: "Avengers: Endgame"
  },
  {
    dialogue: "Wakanda Forever!",
    character: "T'Challa",
    movie: "Black Panther"
  },
  {
    dialogue: "To infinity... and beyond!",
    character: "Buzz Lightyear",
    movie: "Toy Story"
  },
  {
    dialogue: "Just keep swimming.",
    character: "Dory",
    movie: "Finding Nemo"
  },
  {
    dialogue: "Carpe diem. Seize the day.",
    character: "John Keating",
    movie: "Dead Poets Society"
  },
  {
    dialogue: "Adventure is out there!",
    character: "Ellie",
    movie: "Up"
  },
  {
    dialogue: "You talking to me?",
    character: "Travis Bickle",
    movie: "Taxi Driver"
  },
  {
    dialogue: "Every man dies. Not every man really lives.",
    character: "William Wallace",
    movie: "Braveheart"
  },
  {
    dialogue: "Fear can hold you prisoner. Hope can set you free.",
    character: "Andy Dufresne",
    movie: "The Shawshank Redemption"
  },
  {
    dialogue: "Get busy living, or get busy dying.",
    character: "Andy Dufresne",
    movie: "The Shawshank Redemption"
  },
  {
    dialogue: "Keep your friends close, but your enemies closer.",
    character: "Michael Corleone",
    movie: "The Godfather Part II"
  },
  {
    dialogue: "Life is like a box of chocolates.",
    character: "Forrest Gump",
    movie: "Forrest Gump"
  },
  {
    dialogue: "Dreams feel real while we're in them.",
    character: "Cobb",
    movie: "Inception"
  },
  {
    dialogue: "You mustn't be afraid to dream a little bigger, darling.",
    character: "Eames",
    movie: "Inception"
  },
  {
    dialogue: "Do, or do not. There is no try.",
    character: "Yoda",
    movie: "The Empire Strikes Back"
  },
  {
    dialogue: "Hope is a good thing, maybe the best of things.",
    character: "Andy Dufresne",
    movie: "The Shawshank Redemption"
  },
  {
    dialogue: "After all, tomorrow is another day.",
    character: "Scarlett O'Hara",
    movie: "Gone with the Wind"
  },
  {
    dialogue: "The world ain't all sunshine and rainbows.",
    character: "Rocky Balboa",
    movie: "Rocky Balboa"
  },
  {
    dialogue: "No one can make you feel inferior without your consent.",
    character: "Mia Thermopolis",
    movie: "The Princess Diaries"
  },
  {
    "dialogue": "Brooks was here.",
    "character": "Brooks Hatlen",
    "movie": "The Shawshank Redemption"
  }
];

const randomIndex = Math.floor(Math.random()*quotes.length)

  return (
    <div className='QuoteContainer'>
      <div className='quoteIcon'>
        <Quote size={35}/>
      </div>
      <div className='quoteTitle'>{quotes[randomIndex].dialogue}</div>
      <div className='quoteDetails'>
        <span className='quoteSpeaker'>- {quotes[randomIndex].character}</span>
        <span className='quoteMovie'>({quotes[randomIndex].movie})</span>
      </div>
    </div>
  )
}

export default Quotes
