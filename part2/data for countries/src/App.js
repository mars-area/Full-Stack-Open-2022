import React, { useState, useEffect } from "react";
import axios from "axios";

const apikey = "1621b48c8e8660e588854778061c5b25";

const Filter = (props) => {
  return (
    <div>
      find countries{" "}
      <input
        onChange={(e) => props.setQuery(e.target.value)}
        value={props.query}
      />
    </div>
  );
};

const Countries = (props) => {
  const filteredCountries = props.country.filter((country) =>
    country.name.common.toLowerCase().includes(props.query.toLowerCase())
  );
  return (
    <>
      {!props ? (
        <p>No country</p>
      ) : filteredCountries.length === 0 ? (
        <p>Country not found</p>
      ) : filteredCountries.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : filteredCountries.length === 1 ? (
        <>
          <h1>{filteredCountries[0].name.common}</h1>
          {filteredCountries[0].capital.map((capital) => (
            <p key={capital}>Capital: {capital}</p>
          ))}
          <h2>Languages:</h2>
          <ul>
            {Object.values(filteredCountries[0].languages).map((language) => (
              <li key={language}>{language}</li>
            ))}
          </ul>
          <img
            src={
              filteredCountries[0].flags.svg
                ? filteredCountries[0].flags.svg
                : filteredCountries[0].flags.png
            }
            alt="flag"
            width={150}
          />
          {/* { getWeather({ lat: filteredCountries[0].latlng[0], lon: filteredCountries[0].latlng[1] }) } */}
          <Weather city={filteredCountries[0]} />
        </>
      ) : (
        <>
          {filteredCountries.map((country, index) => (
            <div key={index + 1}>
              <div>{country.name.common}</div>
              <button onClick={() => props.setQuery(country.name.common)}>
                show
              </button>
            </div>
          ))}
        </>
      )}
    </>
  );
};

const Weather = (props) => {
  const [weather, setWeather] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [logo, setLogo] = useState("");

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${props.city.latlng[0]}&lon=${props.city.latlng[1]}&units=metric&appid=${apikey}`
      )
      .then((response) => {
        setWeather(response.data);
        setLogo(response.data.weather[0].icon);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
        setError(error);
      });
  }, [props.city.latlng]);

  return (
    <>
      {props.city && (
        <>
          {isLoading ? (
            <p>loading...</p>
          ) : error ? (
            <p>Failed to get weather data.</p>
          ) : (
            <>
              {weather && (
                <>
                <h2>Weather in {weather?.name}</h2>
                <p>Temperature: {weather?.main?.temp} Celcius</p>
                {logo && (<img src={`http://openweathermap.org/img/wn/${logo}@2x.png`} alt="weather" />)}
                <p>Wind Speed: {weather?.wind?.speed} m/s</p>
              </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

const App = () => {
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((response) => {
        setData(response.data);
        console.log(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("error:", error);
      });
  }, []);

  return (
    <div>
      <Filter setQuery={setQuery} query={query} />
      {isLoading ? (
        <p>loading...</p>
      ) : (
        <>
          <Countries country={data} query={query} setQuery={setQuery} />
        </>
      )}
    </div>
  );
};

export default App;