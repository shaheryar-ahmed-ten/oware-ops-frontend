import React, { useRef, useState, useEffect } from "react";

import styled from "styled-components";

const StyledContainer = styled.div`
  position: relative;
  //   border: 1px solid #c7c7c7;
  //   height: 128px;
  width: 780px;
  display: flex;
  align-items: center;
  //   box-shadow: 0px 0px 16px 0px rgba(255, 255, 255, 0.1);
`;

const StyledList = styled.div`
  width: 100%;
  height: 40px;
  overflow-y: scroll;

  scroll-snap-type: y mandatory;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    width: 0 !important;
  }
`;

const StyledTrack = styled.div`
  width: 33%;
  flex-grow: 1;
  //   height: 128px;
  overflow-y: hidden;
  border-right: ${(props) => (props.border ? "1px solid #ffffff" : "")};
`;

const StyledNumber = styled.div`
  position: relative;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  scroll-snap-align: center;
  background-color: #ffffff;
  color: black;
`;

const StyledHeader = styled.div`
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #c7c7c7;
  background-color: #f9f9f9;
`;

const DurationTrack = ({ numbers, qualifier, border, onChange, value }) => {
  const list = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          onChange(Number.parseFloat(entry.target.textContent));
        });
      },
      { threshold: 0.75 }
    );
    [...list.current.children].forEach((child) => {
      observer.observe(child);
    });
  }, []);

  const renderNumberJSX = () => {
    return numbers.map((number, i) =>
      value ? (
        <StyledNumber key={qualifier + value}>{value}</StyledNumber>
      ) : (
        <StyledNumber key={qualifier + number}>{number}</StyledNumber>
      )
    );
  };

  return (
    <StyledTrack border={border}>
      <StyledHeader>{qualifier}</StyledHeader>
      <StyledList ref={list}>{renderNumberJSX()}</StyledList>
    </StyledTrack>
  );
};

const DurationInput = ({ label, setDuration, duration, setETA, selectedRide }) => {
  //   const [duration, setDuration] = useState(0);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  //   setLabel(label)

  useEffect(() => {
    if (!selectedRide) {
      const value = days * 8640 + hours * 3600 + minutes * 60;
      setDuration(value);
      setETA(duration);
    }
  }, [days, minutes, hours]);

  useEffect(() => {
    secondsToDhms(selectedRide);
    const value = days * 8640 + hours * 3600 + minutes * 60;
    setDuration(value);
    setETA(duration);
  }, [selectedRide, days, hours, minutes, duration]);

  function secondsToDhms(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor((seconds % (3600 * 24)) / 3600);
    var m = Math.floor((seconds % 3600) / 60);

    setDays(d);
    setHours(h);
    setMinutes(m);
  }

  return (
    <>
      <div>{label}</div>
      <StyledContainer>
        <DurationTrack
          numbers={[...Array(14).keys()]}
          border
          qualifier="day(s)"
          value={days}
          onChange={(value) => setDays(value)}
        />
        <DurationTrack
          numbers={[...Array(24).keys()]}
          border
          qualifier="hour(s)"
          value={hours}
          onChange={(value) => setHours(value)}
        />
        <DurationTrack
          numbers={[...Array(60).keys()]}
          qualifier="min(s)"
          value={minutes}
          onChange={(value) => setMinutes(value)}
        />
      </StyledContainer>
    </>
  );
};

export default DurationInput;
