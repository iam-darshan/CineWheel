const fs = require('fs');

// Put your NEW TMDB API Key here
const API_KEY = '004a86336944d50c3df15414daa2c285';


// ==========================================
// COMEDY MOVIES COLLECTION
// ==========================================

const mediaIds = [

    // 1. The Dictator
    { id: 76493, mediaType: "movie" },

    // 2. Superbad
    { id: 8363, mediaType: "movie" },

    // 3. The Hangover
    { id: 18785, mediaType: "movie" },

    // 4. 21 Jump Street
    { id: 64688, mediaType: "movie" },

    // 5. 22 Jump Street
    { id: 187017, mediaType: "movie" },

    // 6. We're the Millers
    { id: 138832, mediaType: "movie" },

    // 7. Step Brothers
    { id: 12133, mediaType: "movie" },

    // 8. Dumb and Dumber
    { id: 8467, mediaType: "movie" },

    // 9. Tropic Thunder
    { id: 7446, mediaType: "movie" },

    // 10. Borat
    { id: 496, mediaType: "movie" },

    // 11. Shaun of the Dead
    { id: 747, mediaType: "movie" },
    { id:308266 , mediaType:"movie"},

    // 12. Hot Fuzz
    { id: 4638, mediaType: "movie" },

    // 13. The Grand Budapest Hotel
    { id: 120467, mediaType: "movie" },

    // 14. The Nice Guys
    { id: 290250, mediaType: "movie" },

    // 15. Game Night
    { id: 445571, mediaType: "movie" },

    // 16. Horrible Bosses
    { id: 51540, mediaType: "movie" },

    // 17. Horrible Bosses 2
    { id: 227159, mediaType: "movie" },

    // 18. Due Date
    { id: 41733, mediaType: "movie" },

    // 19. This Is the End
    { id: 109414, mediaType: "movie" },

    // 20. Neighbors
    { id: 195589, mediaType: "movie" },

    // 21. Bridesmaids
    { id: 487, mediaType: "movie" },

    // 22. The 40-Year-Old Virgin
    { id: 6957, mediaType: "movie" },

    // 23. Anchorman: The Legend of Ron Burgundy
    { id: 8699, mediaType: "movie" },

    // 24. Anchorman 2: The Legend Continues
    { id: 109439, mediaType: "movie" },

    // 25. Mean Girls
    { id: 10625, mediaType: "movie" },

    // 26. Easy A
    { id: 37735, mediaType: "movie" },

    // 27. The Other Guys
    { id: 27578, mediaType: "movie" },

    // 28. Get Hard
    { id: 257091, mediaType: "movie" },

    // 29. Central Intelligence
    { id: 302699, mediaType: "movie" },

    // 30. Rush Hour
    { id: 2109, mediaType: "movie" },

    // 31. Rush Hour 2
    { id: 5175, mediaType: "movie" },

    // 32. Rush Hour 3
    { id: 5174, mediaType: "movie" },

    // 33. American Pie
    { id: 2105, mediaType: "movie" },

    // 34. EuroTrip
    { id: 9358, mediaType: "movie" },

    // 35. Yes Man
    { id: 10200, mediaType: "movie" },

    // 36. Liar Liar
    { id: 1624, mediaType: "movie" },

    // 37. Bruce Almighty
    { id: 310, mediaType: "movie" },

    // 38. Mr. Bean's Holiday
    { id: 1268, mediaType: "movie" },

    // 39. The Mask
    { id: 854, mediaType: "movie" },

    // 40. The Dictator - optional replacement slot
    // { id: 76493, mediaType: "movie" }

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

        id: "comedyMovies",

        title: "Comedy Movies",

        movies: movieResults

    };


    fs.writeFileSync(

        "comedy_movies_list.json",

        JSON.stringify(outputData, null, 2)

    );


    console.log(
        `\nSaved ${movieResults.length} items to comedy_movies_list.json!`
    );

}


fetchMediaData();