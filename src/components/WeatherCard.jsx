import React from "react";
import { useState, useEffect, useCallback } from "react";

import styled from "@emotion/styled";
import { css, keyframes } from "@emotion/react";

import humidity from "../images/006-humidity.png";
import wind from "../images/005-wind.png";
import { ReactComponent as RefreshIcon } from "../images/refresh.svg";
import { ReactComponent as LoadingIcon } from "../images/loading.svg";

import daytime from "../images/p1.webp";
import dusk from "../images/p2.webp";
import night from "../images/p3.webp";

import WeatherIcon from "./WeatherIcon";

// animation

const float = keyframes`
    0%{
      background-position:0% 60%;
    }
    100%{
      background-position:100% 10%;
    }
`;

// image

const imgDefault = css`
  background-size: 100% 100%;
  width: 20px;
  height: 20px;
  margin-right: 5px;
`;

const HumidityImg = styled.div`
  ${imgDefault}
  background-image: url(${humidity});
`;

const WindImg = styled.div`
  ${imgDefault}
  background-image: url(${wind});
`;

// background

const Container = styled.div`
  position: relative;
  min-width: 300px;
  height: 649.6px;
  border-radius: 20px;
  box-shadow: 0 1px 10px 5px #2b2b2b;
  background-color: #f9f9f9;
  box-sizing: border-box;
  padding: 30px 15px;
  background-image: ${(props) => `url(${props.bg})`};
  background-size: 100% 100%;
  background-repeat: no-repeat;
  overflow: hidden;
  z-index: 0;
  transition: all 0.5s;
  animation: ${float} 6s ease infinite alternate;
  background-size: 120% 120%;
`;

// refresh and loading icon layout
const Redo = styled.div`
  /* ... */
  svg {
    margin-left: 10px;
    width: 20px;
    height: 20px;
    cursor: pointer;
    animation: rotate infinite 1.5s linear;

    /* STEP 2：取得傳入的 props 並根據它來決定動畫要不要執行 */
    animation-duration: ${({ isLoading }) => (isLoading ? "1.5s" : "0s")};
  }

  @keyframes rotate {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }
`;

// headerArea

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
`;

const Location = styled.div`
  font-size: 40px;
  font-weight: 600;
  color: #454545;
  margin-bottom: 5px;
`;

const Description = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #454545;
  margin-left: 5px;
`;

// mainArea

const Main = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  color: #454545;
  font-size: 76px;
  font-weight: 300;
  display: flex;
`;

const Celsius = styled.div`
  font-weight: normal;
  font-size: 24px;
`;

// footerArea

const Footer = styled.div`
  display: flex;
  box-sizing: border-box;
  justify-content: space-around;
  align-items: center;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 20px 10px;
`;

const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: #beebfa;
`;

const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: #77bef4;
`;

export default function WeatherCard(props) {
  const { currentWeather, moment, axiosData, currentCity } = props;

  const {
    observationTime,
    temperature,
    windSpeed,
    description,
    weatherCode,
    rainPossibility,
    isLoading,
  } = currentWeather;
  const [currentBg, setCurrentBg] = useState("daytime");

  const timeFormat = useCallback(() => {
    let date = new Date(observationTime);

    let formatDate = new Intl.DateTimeFormat("zh-TW", {
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    }).format(date);

    return formatDate;
  }, [observationTime]);

  const bgChange = useCallback(() => {
    const bgArr = {
      daytime,
      dusk,
      night,
    };

    const hour = timeFormat().split(":")[0];

    if (hour >= 17 && hour <= 19) {
      setCurrentBg(bgArr.dusk);
    } else if (hour > 19 || (hour >= 0 && hour < 5)) {
      setCurrentBg(bgArr.night);
    } else {
      setCurrentBg(bgArr.daytime);
    }
  }, [timeFormat]);

  useEffect(() => {
    bgChange();
  }, [currentWeather, bgChange]);

  return (
    <Container bg={currentBg}>
      <Header>
        <HeaderLeft>
          <Location>{currentCity}</Location>
          <Description>
            {description}
            {" / "}
            {timeFormat()}
          </Description>
        </HeaderLeft>
        <WeatherIcon
          currentWeatherCode={weatherCode}
          moment={moment}
        ></WeatherIcon>
      </Header>

      <Main>
        <Temperature>
          {temperature === -1 ? "沒資料" : `${temperature.toFixed()}`}{" "}
          <Celsius>°C</Celsius>
        </Temperature>
      </Main>

      <Footer>
        <AirFlow>
          <WindImg />
          {windSpeed === -1 ? `未知風速` : `${windSpeed}m/h`}
        </AirFlow>
        <Rain>
          <HumidityImg />
          {rainPossibility === -1 ? `未知降雨量` : `${rainPossibility}%`}
        </Rain>
        <Redo onClick={axiosData} isLoading={isLoading}>
          {isLoading ? <LoadingIcon /> : <RefreshIcon />}
        </Redo>
      </Footer>
    </Container>
  );
}
