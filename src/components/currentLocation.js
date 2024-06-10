import React, { useState, useEffect } from "react";
import apiKeys from "../apiKeys";
import Clock from "react-live-clock";
import Forcast from "./forcast";
import loader from "../images/WeatherIcons.gif";
import CLOUDY from "../images/CLOUDY.jpg";
import CLEAR_DAY from "../images/CLEAR_DAY.jpg";
import FOG from "../images/FOG.jpg";
import RAIN from "../images/RAIN.jpg";
import SLEET from "../images/SLEET.jpg";
import SNOW from "../images/SNOW.jpg";
import WIND from "../images/WIND.jpg";
import ReactAnimatedWeather from "react-animated-weather";
import moment from "moment";
import axios from "axios";

const defaults = {
  color: "white",
  size: 112,
  animate: true,
};

const getIcon = {
  CLOUDY: CLOUDY,
  CLEAR_DAY: CLEAR_DAY,
  FOG: FOG,
  RAIN: RAIN,
  SLEET: SLEET,
  SNOW: SNOW,
  WIND: WIND,
};

const Weather = () => {
  const [weatherData, setWeatherData] = useState({
    lat: undefined,
    lon: undefined,
    temperatureC: undefined,
    temperatureF: undefined,
    city: undefined,
    country: undefined,
    humidity: undefined,
    description: undefined,
    icon: "CLEAR_DAY",
    main: undefined,
  });

  const [loading, setLoading] = useState(false);

  const [originalData, setOriginalData] = useState({});
  const [query, setQuery] = useState("");

  const getInitialData = async () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await getWeather({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        async (err) => {
          await getWeather({ city: "delhi" });
          alert(
            "You have disabled location service. Real time weather for your current location requires location permission."
          );
        }
      );
    } else {
      alert("Geolocation not available");
    }
    setLoading(false);
  };

  useEffect(() => {
    getInitialData();
  }, []);

  const getWeather = async ({ lat, lon, city }) => {
    const data = await axios
      .get(`${apiKeys?.base}weather`, {
        params: {
          ...(city ? { q: city } : { lat, lon }),
          units: "metric",
          APPID: apiKeys?.key,
        },
      })
      .then((res) => res?.data)
      .catch((err) => {
        console.log(err);
        return {};
      });

    if (Object.keys(data)?.length) {
      setOriginalData(data);
      setWeatherData((prevState) => ({
        ...prevState,
        lat: lat,
        lon: lon,
        city: data.name,
        temperatureC: Math.round(data.main.temp),
        temperatureF: Math.round(data.main.temp * 1.8 + 32),
        humidity: data.main.humidity,
        main: data.weather[0].main,
        country: data.sys.country,
        // sunrise: getTimeFromUnixTimeStamp(data.sys.sunrise),
        // sunset: getTimeFromUnixTimeStamp(data.sys.sunset),
      }));

      switch (data.weather[0].main) {
        case "Haze":
          setWeatherData((prevState) => ({ ...prevState, icon: "CLEAR_DAY" }));
          break;
        case "Clouds":
          setWeatherData((prevState) => ({ ...prevState, icon: "CLOUDY" }));
          break;
        case "Rain":
          setWeatherData((prevState) => ({ ...prevState, icon: "RAIN" }));
          break;
        case "Snow":
          setWeatherData((prevState) => ({ ...prevState, icon: "SNOW" }));
          break;
        case "Dust":
          setWeatherData((prevState) => ({ ...prevState, icon: "WIND" }));
          break;
        case "Drizzle":
          setWeatherData((prevState) => ({ ...prevState, icon: "SLEET" }));
          break;
        case "Fog":
          setWeatherData((prevState) => ({ ...prevState, icon: "FOG" }));
          break;
        case "Smoke":
          setWeatherData((prevState) => ({ ...prevState, icon: "FOG" }));
          break;
        case "Tornado":
          setWeatherData((prevState) => ({ ...prevState, icon: "WIND" }));
          break;
        default:
          setWeatherData((prevState) => ({ ...prevState, icon: "CLEAR_DAY" }));
      }
    }
  };

  return (
    <>
      <form
        className="search-box"
        onSubmit={(e) => {
          e.preventDefault();
          query && getWeather({ city: query });
        }}
      >
        <input
          type="text"
          className="search-bar"
          placeholder="Search any city (Default is Current Location)"
          onChange={(e) => {
            if (!e.target.value) {
              getInitialData();
            }
            setQuery(e.target.value);
          }}
          value={query}
        />
        <button className="img-box" type="submit" style={{ border: "none" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </button>
      </form>
      <div className="container">
        {weatherData.temperatureC ? (
          <React.Fragment>
            <div
              className="city"
              style={{
                backgroundImage: `url(${
                  getIcon[weatherData?.icon]
                }), url("./images/city.jpg"),
    linear-gradient(to bottom, #afafaf, #afafaf)`,
                backgroundBlendMode: "multiply",
              }}
            >
              <div className="title">
                <h2>{weatherData.city}</h2>
                <h3>{weatherData.country}</h3>
              </div>
              <div className="date-time">
                <div className="dmy">
                  <div id="txt"></div>
                  <div className="current-time">
                    <Clock format="HH:mm:ss" interval={1000} ticking={true} />
                  </div>
                  <div className="current-date">
                    {moment().format("dddd, D MMMM YYYY")}
                  </div>
                </div>
                <div className="temperature">
                  <p>
                    {weatherData.temperatureC}°<span>C</span>
                  </p>
                  <span className="slash">/</span>
                  {weatherData.temperatureF} &deg;F
                </div>
              </div>
            </div>
            <Forcast
              icon={weatherData.icon}
              weather={weatherData.main}
              originalData={originalData}
            />
          </React.Fragment>
        ) : (
          <div style={{ width: "100%" }}>
            <img
              alt="/"
              src={loader}
              style={{ width: "50%", WebkitUserDrag: "none" }}
            />
            <h3 style={{ color: "white", fontSize: "22px", fontWeight: "600" }}>
              Data is being fetched
            </h3>
            <h3 style={{ color: "white", marginTop: "10px" }}>
              Please wait for a moment.
            </h3>
          </div>
        )}
      </div>
    </>
  );
};

export default Weather;
