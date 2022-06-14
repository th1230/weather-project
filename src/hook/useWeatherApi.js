import { useState, useEffect, useCallback } from "react";
import axios from "axios";

import { findLocation } from "../js/getLocation";

const getCurrentWeather = (cityname) => {
  return axios
    .get(
      `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-441A7FF7-1E77-4BED-952D-BBE034D94E2D&format=JSON&locationName=${cityname}&elementName=WDSD,TEMP,HUMD&parameterName=CITY`
    )
    .then((res) => {
      const locationData = res?.data.records.location[0];
      if (locationData) {
        return {
          observationTime: locationData.time.obsTime,
          temperature: locationData.weatherElement[1].elementValue * 1,
          windSpeed: locationData.weatherElement[0].elementValue,
          humid: locationData.weatherElement[2].elementValue,
        };
      } else {
        return {
          observationTime: Date.now(),
          temperature: -1,
          windSpeed: -1,
          humid: -1,
        };
      }
    });
};

const getCurrentForecast = (cityname) => {
  return axios
    .get(
      `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-441A7FF7-1E77-4BED-952D-BBE034D94E2D&format=JSON&locationName=${cityname}`
    )
    .then((res) => {
      const locationData = res?.data.records.location[0];
      if (locationData) {
        let weatherElements = locationData.weatherElement.reduce(
          (prev, current) => {
            if (["Wx", "PoP", "CI"].includes(current.elementName)) {
              prev[current.elementName] = {
                ...current.time[0].parameter,
              };
              return prev;
            } else {
              return prev;
            }
          },
          {}
        );
        return {
          description: weatherElements.Wx.parameterName,
          weatherCode: weatherElements.Wx.parameterValue,
          rainPossibility: weatherElements.PoP.parameterName,
          comfortability: weatherElements.CI.parameterName,
        };
      }

      return {
        description: "沒有資料",
        weatherCode: -1,
        rainPossibility: -1,
        comfortability: "未知",
      };
    });
};

function useWeatherApi(cityname) {
  const { locationName } = findLocation(cityname);

  const [currentWeather, setCurrentWeather] = useState({
    observationTime: 0,
    description: "",
    temperature: 0,
    windSpeed: 0,
    humid: 0,
    isLoading: true,
  });

  const axiosData = useCallback(async () => {
    setCurrentWeather((preState) => {
      return { ...preState, isLoading: true };
    });
    let [cw, cf] = await Promise.all([
      getCurrentWeather(locationName),
      getCurrentForecast(cityname),
    ]);
    setCurrentWeather({ ...cw, ...cf, isLoading: false });
  }, [locationName, cityname]);

  useEffect(() => {
    axiosData();
  }, [axiosData]);

  return [currentWeather, axiosData];
}

export default useWeatherApi;
