const API_KEY = "9785721996c65560793286735ebfc1b5";
const API_URL = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const searchBox = document.querySelector(".weather-search input");
const searchBtn = document.querySelector(".weather-search button");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeathercondition(city) {
    const response = await fetch(API_URL + city + `&appid=${API_KEY}`);

    if(response.status == 404) {
        document.querySelector(".weather").style.display="none";
    }else{
        var data = await response.json();

        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind-speed").innerHTML = data.main.wind-speed + "km/hr";
    
        if(data.weather[0].main == "Clouds") {
            weatherIcon.src = "images/clouds.png";
        }
        else if(data.weather[0].main == "Clear") {
            weatherIcon.src = "images/clear.png";
        }
        else if(data.weather[0].main == "Rain") {
            weatherIcon.src = "images/rain.png";
        }
        else if(data.weather[0].main == "Drizzle") {
            weatherIcon.src = "images/drizzle.png";
        }
        else if(data.weather[0].main == "Mist") {
            weatherIcon.src = "images/mist.png";
        }
        else if(data.weather[0].main == "Snow") {
            weatherIcon.src = "images/snow.png";
        }

        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "block";
    }
    }

searchBtn.addEventListener("click", ()=> {
    checkWeathercondition(searchBox.value);
})

checkWeathercondition();