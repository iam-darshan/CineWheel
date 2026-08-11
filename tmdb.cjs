const fs = require('fs');

// Put your NEW TMDB API Key here
const API_KEY = '004a86336944d50c3df15414daa2c285';

// Movies + TV series for the Road to Doomsday collection
const mediaIds = [

    // =========================
    // X-MEN
    // =========================

    { id: 36657, mediaType: "movie" },   // X-Men
    { id: 36658, mediaType: "movie" },   // X2: X-Men United
    { id: 36668, mediaType: "movie" },   // X-Men: The Last Stand
    { id: 127585, mediaType: "movie" },  // X-Men: Days of Future Past

    // Deadpool / Wolverine
    { id: 293660, mediaType: "movie" },  // Deadpool
    { id: 263115, mediaType: "movie" },  // Logan
    { id: 383498, mediaType: "movie" },  // Deadpool 2


    // =========================
    // MCU — INFINITY SAGA
    // =========================

    { id: 1771, mediaType: "movie" },     // Captain America: The First Avenger
    { id: 24428, mediaType: "movie" },    // The Avengers
    { id: 100402, mediaType: "movie" },   // Captain America: The Winter Soldier
    { id: 99861, mediaType: "movie" },    // Avengers: Age of Ultron
    { id: 271110, mediaType: "movie" },   // Captain America: Civil War
    { id: 497698, mediaType: "movie" },   // Black Widow
    { id: 299536, mediaType: "movie" },   // Avengers: Infinity War
    { id: 299534, mediaType: "movie" },   // Avengers: Endgame


    // =========================
    // MCU — MULTIVERSE SAGA
    // =========================

    { id: 84958, mediaType: "tv" },       // Loki
    { id: 85271, mediaType: "tv" },       // WandaVision
    { id: 88396, mediaType: "tv" },       // The Falcon and the Winter Soldier

    { id: 566525, mediaType: "movie" },   // Shang-Chi and the Legend of the Ten Rings
    { id: 634649, mediaType: "movie" },   // Spider-Man: No Way Home
    { id: 453395, mediaType: "movie" },   // Doctor Strange in the Multiverse of Madness
    { id: 616037, mediaType: "movie" },   // Thor: Love and Thunder
    { id: 505642, mediaType: "movie" },   // Black Panther: Wakanda Forever
    { id: 640146, mediaType: "movie" },   // Ant-Man and the Wasp: Quantumania
    { id: 609681, mediaType: "movie" },   // The Marvels

    // Deadpool & Wolverine
    { id: 533535, mediaType: "movie" },   // Deadpool & Wolverine


    // =========================
    // CURRENT MCU
    // =========================

    { id: 822119, mediaType: "movie" },   // Captain America: Brave New World
    { id: 986056, mediaType: "movie" },   // Thunderbolts*
    { id: 617126, mediaType: "movie" }    // The Fantastic Four: First Steps

];


async function fetchMediaData() {

    const movieResults = [];

    for (const item of mediaIds) {

        const { id, mediaType } = item;

        try {

            const response = await fetch(
                `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${API_KEY}`
            );

            if (!response.ok) {

                throw new Error(
                    `Failed to fetch ${mediaType} ${id}: ${response.statusText}`
                );

            }

            const data = await response.json();


            // Different fields are used by TMDB
            // Movies -> title / release_date
            // TV -> name / first_air_date

            const title =
                mediaType === "movie"
                    ? data.title
                    : data.name;

            const releaseDate =
                mediaType === "movie"
                    ? data.release_date
                    : data.first_air_date;


            movieResults.push({

                id: data.id,

                mediaType: mediaType,

                title: title,

                rating: data.vote_average,

                poster_path: data.poster_path,

                release_year:
                    releaseDate
                        ? releaseDate.split('-')[0]
                        : ''

            });


            console.log(
                `Fetched: ${title} | ${mediaType} | Rating: ${data.vote_average}`
            );


        } catch (error) {

            console.error(
                `Error fetching ${mediaType} ${id}:`,
                error.message
            );

        }
    }


    // =========================
    // OUTPUT
    // =========================

    const outputData = {

        id: "road-to-doomsday",

        title: "Road to Doomsday",

        movies: movieResults

    };


    fs.writeFileSync(

        "roadToDoomsday_list.json",

        JSON.stringify(outputData, null, 2)

    );


    console.log(
        `\nSaved ${movieResults.length} items to roadToDoomsday_list.json!`
    );

}


fetchMediaData();