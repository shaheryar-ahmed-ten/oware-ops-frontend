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
    left: "30%",
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
  placeDropoffInputDiv: {
    position: "absolute",
    zIndex: 100,
    top: "80%",
    left: "95%",
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
    width: "50%",
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
  const { setDropOff, setPickUp, pickupLocation, dropoffLocation } = props;

  const [state, setState] = useState({
    mapCenter: {
      lat: pickupLocation ? pickupLocation.lat : 24.8607,
      lng: pickupLocation ? pickupLocation.lng : 67.0011,
    },
    dropoffMarker: {
      lat: dropoffLocation ? dropoffLocation.lat : 24.86071,
      lng: dropoffLocation ? dropoffLocation.lng : 67.00111,
    },
    zoom: 14,
  });

  const sharedContext = useContext(SharedContext);

  useEffect(() => {
    pickupLocation
      ? setState({
          ...state,
          mapCenter: pickupLocation,
        })
      : navigator.geolocation.getCurrentPosition(
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

  const handleChangePickup = (pickupAddress) => {
    console.log("handle change pickup");
    setState({ ...state, pickupAddress });
  };

  const handleChangeDropoff = (dropoffAddress) => {
    console.log("handle change dropoff");
    setState({ ...state, dropoffAddress });
  };

  const handlePickupSelect = (pickupAddress) => {
    console.log("handlePickupSelect:pickupAddress:-", pickupAddress);
    geocodeByAddress(pickupAddress)
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
        setPickUp({
          lat: latLng.lat,
          lng: latLng.lng,
        });
      })
      .catch((error) => console.error("Error", error));
  };
  const handleDropoffSelect = (dropoffAddress) => {
    console.log(`handleDropoffSelect:dropoffAddress:-`, dropoffAddress);
    geocodeByAddress(dropoffAddress)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        setState({
          ...state,
          dropoffMarker: {
            lat: latLng.lat,
            lng: latLng.lng,
          },
          zoom: 17,
        });
        setDropOff({
          lat: latLng.lat,
          lng: latLng.lng,
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
      {console.log(state.dropoffMarker)}
      <Marker
        position={{
          lat: state.dropoffMarker.lat,
          lng: state.dropoffMarker.lng,
        }}
        name={"Dropoff Location"}
      />
      <PlacesAutocomplete value={state.pickupAddress} onChange={handleChangePickup} onSelect={handlePickupSelect}>
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className={classes.placeInputDiv}>
            <input
              {...getInputProps({
                placeholder: "Search Pickup Location...",
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
      <PlacesAutocomplete value={state.dropoffAddress} onChange={handleChangeDropoff} onSelect={handleDropoffSelect}>
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className={classes.placeDropoffInputDiv}>
            <input
              {...getInputProps({
                placeholder: "Search Dropoff Location...",
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
