import { Map, Marker, GoogleApiWrapper } from "google-maps-react";
import React, { useContext, useEffect, useState } from "react";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { makeStyles } from "@material-ui/core";
import { SharedContext } from "../utils/common";

const useStyles = makeStyles((theme) => ({
  "@global": {
    "*::-webkit-scrollbar": {
      width: "0.4em",
    },
    "*::-webkit-scrollbar-track": {
      "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
    },
    "*::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(0,0,0,.1)",
      outline: "1px solid slategrey",
    },
  },
  placeInputDiv: {
    position: "absolute",
    zIndex: 100,
    top: "80%",
    left: "50%",
    [theme.breakpoints.up("md")]: {
      width: "50%",
    },
    [theme.breakpoints.down("md")]: {
      width: "80%",
    },
    transform: "translateX(-50%)",
    fontSize: 12,
    color: "black",
  },
  placeInput: {
    width: "100%",
    borderRadius: "10px",
    padding: "10px 5px",
    border: 0,
    transition: ".1s",
    outline: "none",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.05)",
  },
}));

function GoogleMap(props) {
  const classes = useStyles();

  const [state, setState] = useState({
    mapCenter: {
      lat: 24.8607,
      lng: 67.0011,
    },
    zoom: 14,
  });

  const sharedContext = useContext(SharedContext);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          ...state,
          mapCenter: {
            lat: position.coords.latitude || 24.8607,
            lng: position.coords.longitude || 67.0011,
          },
        });
      },
      () => {
        setState({
          ...state,
          mapCenter: {
            lat: 24.8607,
            lng: 67.0011,
          },
        });
      }
    );
  }, []);

  useEffect(() => {
    sharedContext.setSelectedMapLocation(state.mapCenter);
  }, [state.mapCenter]);

  const handleChange = (address) => {
    setState({ ...state, address });
  };

  const handleSelect = (address) => {
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        setState({
          ...state,
          mapCenter: {
            lat: latLng.lat,
            lng: latLng.lng,
          },
          zoom: 17,
        });
      })
      .catch((error) => console.error("Error", error));
  };

  return (
    <Map
      google={props.google}
      initialCenter={{
        lat: state.mapCenter.lat,
        lng: state.mapCenter.lng,
      }}
      center={{
        lat: state.mapCenter.lat,
        lng: state.mapCenter.lng,
      }}
      zoom={state.zoom}
      style={{ position: "relative", height: "100%" }}
    >
      <Marker
        position={{
          lat: state.mapCenter.lat,
          lng: state.mapCenter.lng,
        }}
        name={"Your position"}
      />
      <PlacesAutocomplete value={state.address} onChange={handleChange} onSelect={handleSelect}>
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className={classes.placeInputDiv}>
            <input
              {...getInputProps({
                placeholder: "Search Places ...",
                className: "location-search-input",
              })}
              className={classes.placeInput}
            />
            <div className="autocomplete-dropdown-container" style={{ overflowY: "auto", maxHeight: 150 }}>
              {loading && <div>Loading...</div>}
              {suggestions.map((suggestion) => {
                const className = suggestion.active ? "suggestion-item--active" : "suggestion-item";
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? {
                      backgroundColor: "#fafafa",
                      cursor: "pointer",
                      borderBottom: "1px solid black",
                      padding: "5px 5px",
                    }
                  : {
                      backgroundColor: "#ffffff",
                      cursor: "pointer",
                      borderBottom: "1px solid black",
                      padding: "5px 5px",
                    };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    </Map>
  );
}

// export default GoogleMap
export default GoogleApiWrapper({
  apiKey: "AIzaSyC3T1GyCUwIoVxeQYrrC_SLGck_weIh8ts",
})(GoogleMap);
