/* .......... OPENWEATHER API CONFIG .......... */

const currentWeatherContainer = document.querySelector("#current-weather");
const weatherForecastContainer = document.querySelector("#weather-forecast");

const apiKey = "a1725a96c9a460779f3148cadcfdbe09";

const lat = -13.5319;   // for Cusco
const lon = -71.9675;

const currentWeatherUrl =
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

const forecastUrl =
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;


/* .......... FETCH CURRENT WEATHER .......... */

async function getCurrentWeatherData() {
    const response = await fetch(currentWeatherUrl);

    if (!response.ok) {
        throw new Error("Current weather request failed");
    }

    return await response.json();
}


/* .......... FETCH FORECAST .......... */

async function getForecastData() {
    const response = await fetch(forecastUrl);

    if (!response.ok) {
        throw new Error("Forecast request failed");
    }

    const data = await response.json();

    const dailyForecast = data.list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );

    return dailyForecast.slice(0, 3);
}


/* .......... CURRENT WEATHER RENDER .......... */

function displayCurrentWeather(data) {
    if (!currentWeatherContainer) return;

    const iconsrc = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    const desc = data.weather[0].description;

    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit"
    });

    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit"
    });

    currentWeatherContainer.innerHTML = `
        <div class="weather-layout">
            <div class="weather-icon">
                <img src="${iconsrc}" alt="${desc}">
            </div>

            <div class="weather-details">
                <p class="weather-temp">${Math.round(data.main.temp)}°C</p>
                <p>${desc}</p>
                <p><strong>High:</strong> ${Math.round(data.main.temp_max)}°C</p>
                <p><strong>Low:</strong> ${Math.round(data.main.temp_min)}°C</p>
                <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
                <p><strong>Sunrise:</strong> ${sunrise}</p>
                <p><strong>Sunset:</strong> ${sunset}</p>
            </div>
        </div>
    `;
}

/* .......... FORECAST RENDER .......... */

function displayForecast(data) {
    if (!weatherForecastContainer) return;

    weatherForecastContainer.innerHTML = `

        ${data.map(item => `
            <div class="forecast-item">
                <p>
                    <strong>${new Date(item.dt_txt).toLocaleDateString("en-US", {
        weekday: "long"
    })}:</strong>
                    ${Math.round(item.main.temp)}°C
                </p>
            </div>
        `).join("")}
    `;
}


/* .......... INIT .......... */

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