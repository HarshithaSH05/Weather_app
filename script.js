const apiKey = "a442229e83723b52af525d4f08e02491"; 

async function getWeather() {
  const city = document.getElementById("cityInput").value;
  const weatherDiv = document.getElementById("weather");
  const loadingDiv = document.getElementById("loading");

  if (!city) {
    weatherDiv.innerHTML = "<p>Please enter a city name.</p>";
    return;
  }

  loadingDiv.style.display = "block"; // Show loading animation
  weatherDiv.innerHTML = "";

  try {
    // Current weather
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) throw new Error("City not found");

    const data = await response.json();

    weatherDiv.innerHTML = `
      <h2>${data.name}</h2>
      <p><img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="icon"></p>
      <p>🌡 Temperature: ${data.main.temp} °C</p>
      <p>☁ Condition: ${data.weather[0].description}</p>
      <p>💧 Humidity: ${data.main.humidity}%</p>
      <p>🌬 Wind Speed: ${data.wind.speed} m/s</p>
    `;

    // ✅ Use standardized "main" field for background
    changeBackground(data.weather[0].main);

    // Fetch forecast
    await getForecast(city);

  } catch (error) {
    weatherDiv.innerHTML = `<p>${error.message}</p>`;
  } finally {
    loadingDiv.style.display = "none"; // Hide loading animation
  }
}

async function getForecast(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
  );
  const data = await response.json();

  const forecastDiv = document.createElement("div");
  forecastDiv.innerHTML = "<h3>5-Day Forecast</h3>";

  for (let i = 0; i < data.list.length; i += 8) {
    const day = data.list[i];
    forecastDiv.innerHTML += `
      <p>
        📅 ${new Date(day.dt_txt).toDateString()} <br>
        🌡 ${day.main.temp} °C <br>
        ☁ ${day.weather[0].description}
      </p>
    `;
  }

  document.getElementById("weather").appendChild(forecastDiv);
}

function changeBackground(conditionMain) {
  const body = document.body;
  let gradient;

  switch (conditionMain.toLowerCase()) {
    case "clouds":
      gradient = "linear-gradient(to right, #bdc3c7, #2c3e50)"; // cloudy
      break;
    case "rain":
    case "drizzle":
      gradient = "linear-gradient(to right, #00c6ff, #0072ff)"; // rainy
      break;
    case "clear":
      gradient = "linear-gradient(to right, #f7971e, #ffd200)"; // sunny
      break;
    case "snow":
      gradient = "linear-gradient(to right, #83a4d4, #b6fbff)"; // snowy
      break;
    case "thunderstorm":
      gradient = "linear-gradient(to right, #434343, #000000)"; // thunderstorm
      break;
    case "mist":
    case "fog":
    case "haze":
      gradient = "linear-gradient(to right, #757f9a, #d7dde8)"; // misty/foggy
      break;
    default:
      gradient = "linear-gradient(to right, #4facfe, #00f2fe)"; // default
  }

  // Smooth transition
  body.style.transition = "background 1s ease-in-out";
  body.style.background = gradient;
}
