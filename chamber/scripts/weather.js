/* ..........  WEATHER MODULE / MY API-READY MOCK VERSION  ........... */

const currentWeatherContainer = document.querySelector("#current-weather");
const weatherForecastContainer = document.querySelector("#weather-forecast");


/* .........  MOCK DATA (OpenWeather API Shape)  ......... */

const mockCurrentWeather = {
    main: {
        temp: 18,
        temp_max: 22,
        temp_min: 11,
        humidity: 52
    },
    weather: [
        {
            description: "Partly Cloudy",
            icon: "03d"
        }
    ],
    sys: {
        sunrise: "6:08 AM",
        sunset: "5:42 PM"
    },
    name: "Cusco"
};

const mockForecast = {
    list: [
        {
            label: "Today",
            temp: 19
        },
        {
            label: "Wednesday",
            temp: 17
        },
        {
            label: "Thursday",
            temp: 16
        }
    ]
};


/* .........  DATA PROVIDERS (For Replace with API Later)  ....... */

async function getCurrentWeatherData() {
    return mockCurrentWeather;
}

async function getForecastData() {
    return mockForecast;
}


/* .............  HOW SHOW WEATHER RENDER  ............ */

function displayCurrentWeather(data) {
    if (!currentWeatherContainer) return;

    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    currentWeatherContainer.innerHTML = `
        <div class="weather-block">
            <div class="weather-layout">

                <div class="weather-icon">
                    <img src="${iconUrl}" alt="${data.weather[0].description}">
                </div>

                <div class="weather-details">
                    <p class="weather-temp">
                        ${Math.round(data.main.temp)}°C
                    </p>

                    <p>${data.weather[0].description}</p>
                    <p><strong>Máxima:</strong> ${Math.round(data.main.temp_max)}°C</p>
                    <p><strong>Mínima:</strong> ${Math.round(data.main.temp_min)}°C</p>
                    <p><strong>Humedad:</strong> ${data.main.humidity}%</p>
                    <p><strong>Amanecer:</strong> ${data.sys.sunrise}</p>
                    <p><strong>Puesta de sol:</strong> ${data.sys.sunset}</p>
                </div>

            </div>
        </div>
    `;
}

/* ..................  FORECAST RENDER  ................. */

function displayForecast(data) {
    if (!weatherForecastContainer) return;

    weatherForecastContainer.innerHTML = data.list
        .map(item => `
            <div class="forecast-item">
                <p>
                    <strong>${item.label}:</strong> ${item.temp}°C
                </p>
            </div>
        `)
        .join("");
}


/* ...........  INIT  .............. */

async function initWeather() {
    try {
        const currentWeather = await getCurrentWeatherData();
        const forecast = await getForecastData();

        displayCurrentWeather(currentWeather);
        displayForecast(forecast);

    } catch (error) {
        console.error("Weather loading failed:", error);

        if (currentWeatherContainer) {
            currentWeatherContainer.innerHTML =
                "<p>Weather information unavailable.</p>";
        }

        if (weatherForecastContainer) {
            weatherForecastContainer.innerHTML =
                "<p>Forecast unavailable.</p>";
        }
    }
}

initWeather();