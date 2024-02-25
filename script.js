const apiKey = "0fb63a4e5974f6c01a7d49fe2ea382b8";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const forecastApiUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

const searchBox = document.querySelector("#locationInput");
const searchBtn = document.querySelector("#searchBtn");
const weatherIcon = document.querySelector(".weather-icon");
const errorDisplay = document.querySelector(".error");
const weatherDisplay = document.querySelector(".weather");
const cityDisplay = document.querySelector(".city");
const humidityDisplay = document.querySelector(".humidity");
const windDisplay = document.querySelector(".wind");
const forecastDaysDisplay = document.querySelector(".forecast-days");
async function fetchWeatherData(city) {
    try {
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
    }
}

async function fetchForecastData(city) {
    try {
        const response = await fetch(forecastApiUrl + city + `&appid=${apiKey}`);
        const data = await response.json();
        return data.list;
    } catch (error) {
        console.error("Error fetching forecast data:", error);
        return null;
    }
}
function displayWeatherData(weatherData) {
    if (!weatherData) {
        errorDisplay.style.display = "block";
        weatherDisplay.style.display = "none";
        return;
    }

    errorDisplay.style.display = "none";
    weatherDisplay.style.display = "block";

    cityDisplay.textContent = weatherData.name;
    humidityDisplay.textContent = `Humidity: ${weatherData.main.humidity}%`;
    windDisplay.textContent = `Wind Speed: ${weatherData.wind.speed}km/h`;

    const temperature = Math.round(weatherData.main.temp);
    document.querySelector('.temp').textContent = `${temperature}°C`;

    const weatherIconUrl = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`;
    weatherIcon.src = weatherIconUrl;
}

function displayForecastData(forecastData) {
    forecastDaysDisplay.innerHTML = "";

    for (let i = 0; i < forecastData.length; i += 8) {
        const forecastItem = forecastData[i];
        const forecastDate = new Date(forecastItem.dt * 1000);
        const forecastDay = forecastDate.toLocaleDateString("en-US", { weekday: "short" });
        const forecastTemp = Math.round(forecastItem.main.temp);

        const forecastDayElement = document.createElement("div");
        forecastDayElement.classList.add("forecast-day");
        forecastDayElement.innerHTML = `
            <p>${forecastDay}</p>
            <img src="https://openweathermap.org/img/wn/${forecastItem.weather[0].icon}.png" >
            <p>${forecastTemp}°C</p>
        `;
        forecastDaysDisplay.appendChild(forecastDayElement);
    }
}
searchBox.addEventListener("keypress", async (event) => {
    if (event.key === "Enter") {
        const city = searchBox.value.trim();
        if (city) {
            const weatherData = await fetchWeatherData(city);
            if (weatherData) {
                displayWeatherData(weatherData);
                const forecastData = await fetchForecastData(city);
                if (forecastData) {
                    displayForecastData(forecastData);
                }
            } else {
                displayWeatherData(null);
            }
        }
    }
});


