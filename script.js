document.getElementById("button").addEventListener("click", function () {
    const city = document.getElementById("name").value;
    if (city) {
        getWeather(city);
    } else {
        alert("Please enter a city.");
    }
});
function getWeather(city) {
    const apiKey = "cda93c107d8c33a69b4088c22caa5e5e"; // Replace with your actual OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === "404") {//200 represents the sucess the city is found and 404 represents failure
                alert("City not found");
            } else {
                displayWeather(data);

                // Extract latitude and longitude from API response
                const { lat, lon } = data.coord;
                updateMap(lat, lon);
            }
        })
        .catch(error => console.error("Error fetching the weather data:", error));
}

// Function to display weather information
function displayWeather(data) {
    const cityName = data.name;
    const temp = data.main.temp;
    const description = data.weather[0].description;
    const humidity = data.main.humidity;

    // Display weather information
    document.getElementById("Weatherinfo").classList.remove("hidden");
    document.getElementById("cityName").textContent = `City: ${cityName}`;
    document.getElementById("temperature").textContent = `Temperature: ${temp}°C`;
    document.getElementById("description").textContent = `Condition: ${description}`;
    document.getElementById("humidity").textContent = `Humidity: ${humidity}%`;

    // Additional Features:
    displayUVIndex(data.coord.lat, data.coord.lon);
    displayWeatherAlert(data.coord.lat, data.coord.lon);
}

// Function to update Google Map iframe
function updateMap(lat, lon) {
    const mapContainer = document.getElementById("mapContainer");
    const iframe = document.getElementById("map");
    iframe.src = `https://www.google.com/maps/embed/v1/place?key=AIzaSyAZQYeZ2RNWti3IRaKlUHt2FkPPLndlKCI&q=${lat},${lon}`;
    mapContainer.style.display = "block"; // Show the map container
}

// Function to display UV index
function displayUVIndex(lat, lon) {
    const apiKey = "cda93c107d8c33a69b4088c22caa5e5e"; // Replace with your actual OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,daily&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const uvIndex = data.current.uvi;
            document.getElementById("uvIndex").textContent = `UV Index: ${uvIndex}`;
            if (uvIndex > 7) {
                document.getElementById("uvIndex").style.color = "red"; // High UV index warning
            } else if (uvIndex > 4) {
                document.getElementById("uvIndex").style.color = "orange"; // Moderate UV index
            } else {
                document.getElementById("uvIndex").style.color = "green"; // Low UV index
            }
        })
        .catch(error => console.error("Error fetching UV index:", error));
}

// Function to display weather alerts
function displayWeatherAlert(lat, lon) {
    const apiKey = "cda93c107d8c33a69b4088c22caa5e5e"; // Replace with your actual OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/alerts?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const alerts = data.alerts;
            if (alerts && alerts.length > 0) {
                let alertText = "Weather Alerts: ";
                alerts.forEach(alert => {
                    alertText += `${alert.event} - ${alert.description}. `;
                });
                document.getElementById("weatherAlert").textContent = alertText;
            } else {
                document.getElementById("weatherAlert").textContent = "No weather alerts.";
            }
        })
        .catch(error => console.error("Error fetching weather alerts:", error));
}