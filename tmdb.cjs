const fs = require('fs');

// Put your NEW TMDB API Key here
const API_KEY = '004a86336944d50c3df15414daa2c285';

// Movies + TV series for the Road to Doomsday collection
const mediaIds = [

  // 1. Spirited Away
  { id: 129, mediaType: "movie" },

  // 2. Spider-Man: Across the Spider-Verse
  { id: 569094, mediaType: "movie" },

  // 3. Spider-Man: Into the Spider-Verse
  { id: 324857, mediaType: "movie" },

  // 4. WALL-E
  { id: 10681, mediaType: "movie" },

  // 5. Toy Story
  { id: 862, mediaType: "movie" },

  // 6. The Lion King
  { id: 8587, mediaType: "movie" },

  // 7. How to Train Your Dragon
  { id: 10191, mediaType: "movie" },

  // 8. Ratatouille
  { id: 2062, mediaType: "movie" },

  // 9. The Wild Robot
  { id: 1184918, mediaType: "movie" },

  // 10. Coco
  { id: 354912, mediaType: "movie" },

  // 11. Your Name
  { id: 372058, mediaType: "movie" },

  // 12. The Incredibles
  { id: 9806, mediaType: "movie" },

  // 13. Princess Mononoke
  { id: 128, mediaType: "movie" },

  // 14. Howl's Moving Castle
  { id: 4935, mediaType: "movie" },

  // 15. Toy Story 3
  { id: 10193, mediaType: "movie" },

  // 16. Up
  { id: 14160, mediaType: "movie" },

  // 17. Fantastic Mr. Fox
  { id: 10315, mediaType: "movie" },

  // 18. A Silent Voice
  { id: 378064, mediaType: "movie" },

  // 19. Shrek 2
  { id: 809, mediaType: "movie" },

  // 20. Finding Nemo
  { id: 12, mediaType: "movie" },

  // 21. Inside Out
  { id: 150540, mediaType: "movie" },

  // 22. Puss in Boots: The Last Wish
  { id: 315162, mediaType: "movie" },

  // 23. Coraline
  { id: 8355, mediaType: "movie" },

  // 24. Klaus
  { id: 508965, mediaType: "movie" },

  // 25. Kung Fu Panda
  { id: 9502, mediaType: "movie" },

  // 26. The Boy and the Heron
  { id: 508883, mediaType: "movie" },

  // 27. Beauty and the Beast
  { id: 10020, mediaType: "movie" },

  // 28. How to Train Your Dragon 2
  { id: 82702, mediaType: "movie" },

  // 29. The Mitchells vs. the Machines
  { id: 501929, mediaType: "movie" },

  // 30. Toy Story 2
  { id: 863, mediaType: "movie" },

  // 31. Kung Fu Panda 2
  { id: 49451, mediaType: "movie" },

  // 32. Shrek
  { id: 808, mediaType: "movie" },

  // 33. Mulan
  { id: 10674, mediaType: "movie" },

  // 34. Big Hero 6
  { id: 177572, mediaType: "movie" },

  // 35. Tangled
  { id: 38757, mediaType: "movie" },

  // 36. Perfect Blue
  { id: 10494, mediaType: "movie" },

  // 37. Soul
  { id: 508442, mediaType: "movie" },

  // 38. The Prince of Egypt
  { id: 9837, mediaType: "movie" },

  // 39. Inside Out 2
  { id: 1022789, mediaType: "movie" },

  // 40. The Nightmare Before Christmas
  { id: 9479, mediaType: "movie" }

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

        id: "animatedMasterpieces",

        title: "Animated Masterpieces",

        movies: movieResults

    };


    fs.writeFileSync(

        "animations_list.json",

        JSON.stringify(outputData, null, 2)

    );


    console.log(
        `\nSaved ${movieResults.length} items to roadToDoomsday_list.json!`
    );

}


fetchMediaData();