import React, { useMemo } from "react";
import { useState, useEffect } from "react";
import useWeatherApi from "../hook/useWeatherApi";

import styled from "@emotion/styled";

import WeatherCard from "./WeatherCard";
import WeatherSetting from "./WeatherSetting";

import getMoment from "../js/getMoment";
import { findLocation } from "../js/getLocation";

const Container = styled.div`
  background-color: #3b3b3b;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function Weather() {
  const [currentCity, setCurrentCity] = useState("臺北市");
  const [currentWeather, axiosData] = useWeatherApi(currentCity);
  const [moment, setMoment] = useState("day");

  const currentLocation = useMemo(
    () => findLocation(currentCity) || {},
    [currentCity]
  );

  useEffect(() => {
    (async function () {
      const monvalue = await getMoment(currentLocation);
      setMoment(monvalue);
    })();
  }, [currentWeather, moment, currentLocation]);

  return (
    <Container>
      <WeatherSetting
        setCurrentCity={setCurrentCity}
        currentCity={currentCity}
      ></WeatherSetting>{" "}
      <WeatherCard
        currentWeather={currentWeather}
        moment={moment}
        axiosData={axiosData}
        currentCity={currentCity}
      ></WeatherCard>
    </Container>
  );
}
