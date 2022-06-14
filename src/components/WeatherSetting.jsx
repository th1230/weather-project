import React from "react";
import { useState } from "react";
import styled from "@emotion/styled";
import { keyframes, css } from "@emotion/react";

import { ReactComponent as Gear } from "../images/gear.svg";

import { locations } from "../js/getLocation";

const WeatherSettingWrapper = styled.div`
  transition: ${(props) =>
    props.maskState ? `z-index 0.1s` : `z-index 0.1s 0.5s`};
  z-index: 2;
`;

const Btn = styled.div`
  position: absolute;
  width: 40px;
  height: 40px;
  right: 20px;
  top: 20px;
  border-radius: 50%;
  background-color: #333333;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 2;
  @media (max-width: 420px) {
    right: 50%;
    top: 70%;
    transform: translate(50%, 0);
  }

  &:hover {
    transform: scale(1.1);
    @media (max-width: 420px) {
      transform: scale(1.1) translate(50%, 0);
    }
  }

  &:active {
    transform: scale(0.9);
    @media (max-width: 420px) {
      transform: scale(0.9) translate(50%, 0);
    }
  }

  svg {
    width: 40px;
    height: 40px;
    fill: #1387f4;
  }
`;

const Mask = styled.div`
  position: fixed;
  right: 40px;
  top: 40px;
  background-image: linear-gradient(to top, #96fbc4 0%, #f9f586 100%);
  width: 10px;
  height: 10px;
  transform: scale(${(props) => (props.maskState === false ? "1" : "2000")});
  border-radius: 50%;
  transition: all 0.4s 0.1s;
  z-index: ${(props) => (props.maskState === true ? 1 : -1)};
  visibility: ${(props) => (props.maskState === true ? "visible" : "hidden")};

  @media (max-width: 420px) {
    right: 50%;
    top: calc(70% + 20px);
  }
`;

const rightIn = keyframes`
  from {
    opacity: 0;
    left: 70%;
    visibility:hidden;
  }

  to {
    opacity: 1;
    left: 50%;
    visibility:visible;
  }
`;

const rightOut = keyframes`
  from {
    opacity: 1;
    left: 50%;
  }

  to {
    opacity: 0;
    left: 70%;
  }
`;

const FormContainer = styled.div`
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: ${(props) => (props.maskState === true ? 2 : 0)};
  background-image: linear-gradient(60deg, #29323c 0%, #485563 100%);
  padding: 30px;
  border-radius: 10px;
  font-weight: 600;
  visibility: hidden;
  pointer-events: ${(props) => (props.maskState ? "auto" : "none")};
  animation: ${(props) =>
    props.maskState === true
      ? css`
          ${rightIn} 0.2s 0.5s forwards
        `
      : css`
          ${rightOut} 0.2s  forwards
        `};

  @media (max-width: 420px) {
    width: 70%;
  }
`;

const Title = styled.div`
  font-size: 28px;
  color: white;
  margin-bottom: 30px;
`;

const StyledLabel = styled.label`
  display: block;
  font-size: 16px;
  color: white;
  margin-bottom: 15px;
`;

const StyledInputList = styled.input`
  display: block;
  box-sizing: border-box;
  background: transparent;
  border: 1px solid white;
  outline: none;
  width: 100%;
  max-width: 100%;
  color: white;
  font-size: 16px;
  padding: 7px 10px;
  margin-bottom: 40px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  > button {
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    user-select: none;
    margin: 0;
    letter-spacing: 0.3px;
    line-height: 1;
    cursor: pointer;
    overflow: visible;
    text-transform: none;
    border: 1px solid transparent;
    background-color: transparent;
    height: 35px;
    width: 80px;
    border-radius: 5px;

    &:focus,
    &.focus {
      outline: 0;
      box-shadow: none;
    }

    &::-moz-focus-inner {
      padding: 0;
      border-style: none;
    }
  }
`;

const Back = styled.button`
  && {
    color: white;
    border-color: white;
    font-weight: 600;
  }
`;

const Save = styled.button`
  && {
    color: black;
    font-weight: 600;
    background-color: #c7f7a4;
  }
`;

const locationNames = locations.map((location) => location.cityName);

export default function WeatherSetting({ setCurrentCity }) {
  const [maskState, setMaskState] = useState(false);
  const [locationName, setLocationName] = useState("臺北市");

  const changeMashState = () => {
    setLocationName((prevState) => prevState);
    setMaskState((prevState) => !prevState);
  };

  const handleChange = (e) => {
    setLocationName(e.target.value);
  };

  const handleSave = () => {
    if (locations.find((location) => location.cityName === locationName)) {
      console.log(`儲存的地區資訊為：${locationName}`);
      setMaskState(false);
      setCurrentCity(locationName);
    } else {
      alert(`儲存失敗：您輸入的 ${locationName} 並非有效的地區`);
      return;
    }
  };

  return (
    <WeatherSettingWrapper maskState={maskState}>
      <Btn>
        <Gear onClick={changeMashState}></Gear>
      </Btn>
      <Mask maskState={maskState}></Mask>

      <FormContainer maskState={maskState}>
        <Title>設定</Title>
        <StyledLabel htmlFor="location">地區</StyledLabel>
        <StyledInputList
          list="location-list"
          id="location"
          name="location"
          value={locationName}
          onChange={handleChange}
        />
        <datalist id="location-list">
          {locationNames.map((name) => (
            <option value={name} key={name} />
          ))}
        </datalist>

        <ButtonGroup>
          <Back onClick={changeMashState}>返回</Back>
          <Save onClick={handleSave}>儲存</Save>
        </ButtonGroup>
      </FormContainer>
    </WeatherSettingWrapper>
  );
}
