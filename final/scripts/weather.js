/* ...............................
   WEATHER API
   Open-Meteo Current Weather
   LocalStorage Cache
   ............................. */

const CACHE_HOURS = 6;
const CACHE_DURATION =
    CACHE_HOURS * 60 * 60 * 1000;

/* ...................
   GET TEMPLE WEATHER
   .................. */

async function getTempleWeather(lat, lon) {

    const cacheKey =
        `weather_${lat}_${lon}`;

    try {

        /* ........ CHECK CACHE ........... */

        const cachedData =
            localStorage.getItem(cacheKey);

        if (cachedData) {

            const parsedCache =
                JSON.parse(cachedData);

            const age =
                Date.now() -
                parsedCache.timestamp;

            if (age < CACHE_DURATION) {

                console.log(
                    "Using cached weather data"
                );

                return parsedCache.weather;
            }
        }

        console.log(
            "Fetching fresh weather data"
        );

        /* ........ API URL ........... */

        const url =
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`;

        /* ....... FETCH WEATHER ....... */

        const response =
            await fetch(url);

        if (!response.ok) {

            throw new Error(
                "Weather API Error"
            );
        }

        const data =
            await response.json();

        /* ...... CURRENT WEATHER ......... */

        const weatherCode =
            data.current.weather_code;

        const temperature =
            Math.round(
                data.current.temperature_2m
            );

        const weather = {

            temperature,

            description:
                weatherDescriptions[weatherCode] ||
                "Unknown",

            icon:
                weatherIcons[weatherCode] ||
                "images/weather/cloudy.svg"
        };

        /* ........ SAVE CACHE ........ */

        localStorage.setItem(
            cacheKey,
            JSON.stringify({
                timestamp: Date.now(),
                weather
            })
        );

        /* ....... RETURN WEATHER .......... */

        return weather;

    } catch (error) {

        console.error(
            "Weather Fetch Error:",
            error
        );

        /* ....... FALLBACK CACHE .......... */

        const cachedData =
            localStorage.getItem(cacheKey);

        if (cachedData) {

            const parsedCache =
                JSON.parse(cachedData);

            console.log(
                "Using expired cache because API failed"
            );

            return parsedCache.weather;
        }

        /* ...... DEFAULT FALLBACK ......... */

        return {

            temperature: "--",

            description:
                "Unavailable",

            icon:
                "images/weather/cloudy.svg"
        };
    }
}