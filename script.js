const apiKey = '21b97cd7a959e2d95d846dfe7de83bf3'; // Replace with your OpenWeatherMap API key

// DOM Elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherCard = document.getElementById('weather-card');
const errorMessage = document.getElementById('error-message');
const loadingSpinner = document.getElementById('loading-spinner');

// Weather elements
const cityName = document.getElementById('city-name');
const country = document.getElementById('country');
const currentDate = document.getElementById('current-date');
const weatherIcon = document.getElementById('weather-icon');
const temperature = document.getElementById('temperature');
const weatherDescription = document.getElementById('weather-description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const feelsLike = document.getElementById('feels-like');
const pressure = document.getElementById('pressure');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');

// Event listeners
searchBtn.addEventListener('click', searchWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchWeather();
    }
});

// Initialize
updateDateTime();
setInterval(updateDateTime, 60000); // Update time every minute

function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    currentDate.textContent = now.toLocaleDateString('en-US', options);
}

async function searchWeather() {
    const city = cityInput.value.trim();
    
    if (!city) {
        showError('Please enter a city name');
        return;
    }

    showLoading();
    hideError();
    hideWeatherCard();

    try {
        const weatherData = await getWeatherData(city);
        updateWeatherUI(weatherData);
    } catch (error) {
        showError('City not found. Please try another location.');
    } finally {
        hideLoading();
    }
}

async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
        throw new Error('City not found');
    }
    
    return await response.json();
}

function updateWeatherUI(data) {
    // Update basic information
    cityName.textContent = data.name;
    country.textContent = data.sys.country;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} m/s`;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    pressure.textContent = `${data.main.pressure} hPa`;

    // Update weather icon
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    weatherIcon.alt = data.weather[0].description;

    // Update sunrise and sunset times
    const sunriseTime = new Date(data.sys.sunrise * 1000);
    const sunsetTime = new Date(data.sys.sunset * 1000);
    sunrise.textContent = formatTime(sunriseTime);
    sunset.textContent = formatTime(sunsetTime);

    // Change background based on weather condition
    updateBackground(data.weather[0].main);

    showWeatherCard();
}

function formatTime(date) {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

function updateBackground(weatherCondition) {
    const body = document.body;
    let gradient;

    switch(weatherCondition.toLowerCase()) {
        case 'clear':
            gradient = 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
            break;
        case 'clouds':
            gradient = 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)';
            break;
        case 'rain':
            gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            break;
        case 'snow':
            gradient = 'linear-gradient(135deg, #e6e9f0 0%, #eef1f5 100%)';
            break;
        case 'thunderstorm':
            gradient = 'linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)';
            break;
        default:
            gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }

    body.style.background = gradient;
}

function showLoading() {
    loadingSpinner.classList.add('active');
}

function hideLoading() {
    loadingSpinner.classList.remove('active');
}

function showWeatherCard() {
    weatherCard.classList.add('active');
}

function hideWeatherCard() {
    weatherCard.classList.remove('active');
}

function showError(message) {
    errorMessage.querySelector('p').textContent = message;
    errorMessage.classList.add('active');
}

function hideError() {
    errorMessage.classList.remove('active');
}

// Load default city on startup
window.addEventListener('load', () => {
    cityInput.value = 'London';
    searchWeather();
});