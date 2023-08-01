const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

let city = "bangalore";

let errorHandling = {
  statusCode: 200,
  message: "There is no error",
};

app.get("/", async (req, res) => {
  let apiKey = process.env.WEATHER_API_KEY;
  let cityName = city;
  const URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
  try {
    let response = await axios.get(URL);
    let weatherData = response.data;

    let temp = weatherData.main.temp;
    let wind = weatherData.wind.speed;
    let humidity = weatherData.main.humidity;
    let weather = weatherData.weather[0].description;
    let id = weatherData.weather[0].id;

    let image = "";

    if (id == 800) {
      image = "clear.png";
    } else if (id > 800) {
      image = "cloudy.png";
    } else if (id >= 600 && id <= 622) {
      image = "snow.png";
    } else if (id >= 500 && id <= 531) {
      image = "rain.png";
    } else if (id >= 300 && id <= 321) {
      image = "drizzle.png";
    } else if (id >= 200 && id <= 232) {
      image = "storm.png";
    } else {
      image = "foggy.png";
    }

    res.render("index", {
      place: cityName,
      temp: temp,
      image: image,
      weather: weather,
      wind: wind,
      humidity: humidity,
    });
  } catch (err) {
    errorHandling = {
      statusCode: err.response.data.cod + " error",
      message: err.response.data.message,
    };
    res.redirect("/error");
  }
});

app.get("/error", (req, res) => {
  res.render("error", {
    statusCode: errorHandling.statusCode,
    message: errorHandling.message,
  });
});

app.post("/", (req, res) => {
  city = req.body.place;
  res.redirect("/");
});

const port=process.env.PORT || 5000;

app.listen(port);
