import { Map, Marker, GoogleApiWrapper, MarkerWithLabel } from "google-maps-react";
import React, { useContext, useEffect, useState } from "react";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { makeStyles } from "@material-ui/core";
import { SharedContext } from "../utils/common";
import dropoffIcon from "./darkgreen_MarkerD.png";
import pickupIcon from "./red_MarkerP.png";

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
    pickupMarker: {
      lat: pickupLocation ? pickupLocation.lat : null,
      lng: pickupLocation ? pickupLocation.lng : null,
    },
    dropoffMarker: {
      lat: dropoffLocation ? dropoffLocation.lat : null,
      lng: dropoffLocation ? dropoffLocation.lng : null,
    },
    mapCenter: {
      lat: 24.916,
      lng: 67.023,
    },
    zoom: 14,
  });

  const [pickupSearchBox, setpickupSearchBox] = useState();

  const sharedContext = useContext(SharedContext);

  useEffect(() => {
    sharedContext.setSelectedMapLocation(state.pickupMarker);
  }, [state.pickupMarker]);

  useEffect(() => {
    setpickupSearchBox(pickupSearchBox);
  }, [pickupSearchBox]);

  const handleChangePickup = (pickupAddress) => {
    setState({ ...state, pickupAddress });
    setpickupSearchBox({ pickupAddress });
  };

  const handleChangeDropoff = (dropoffAddress) => {
    setState({ ...state, dropoffAddress });
  };

  const handlePickupSelect = (pickupAddress) => {
    geocodeByAddress(pickupAddress)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        setState({
          ...state,
          pickupMarker: {
            lat: latLng.lat,
            lng: latLng.lng,
          },
          zoom: 17,
        });
        setPickUp({
          lat: latLng.lat,
          lng: latLng.lng,
        });
        setpickupSearchBox(pickupAddress);
      })
      .catch((error) => console.error("Error", error));
  };
  const handleDropoffSelect = (dropoffAddress) => {
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

  const onPickupMarkerDragEnd = (coord) => {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();
    setState({
      ...state,
      pickupMarker: {
        lat,
        lng,
      },
      zoom: 17,
    });
    setPickUp(state.pickupMarker);
    setDropOff(state.dropoffMarker);
    return state.pickupMarker;
  };

  const onDropoffMarkerDragEnd = (coord) => {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();
    setState({
      ...state,
      dropoffMarker: {
        lat,
        lng,
      },
      zoom: 17,
    });
    setPickUp(state.pickupMarker);
    setDropOff(state.dropoffMarker);
    return state.dropoffMarker;
  };

  return (
    <Map
      google={props.google}
      initialCenter={{
        lat: state.pickupMarker.lat,
        lng: state.pickupMarker.lng,
      }}
      center={{
        lat: state.mapCenter.lat,
        lng: state.mapCenter.lng,
      }}
      zoom={state.zoom}
      style={{ position: "relative", height: "100%" }}
    >
      {/* {state.pickupMarker.lat ? ( */}
      <Marker
        position={{
          lat: state.pickupMarker.lat,
          lng: state.pickupMarker.lng,
        }}
        name={"Pickup Location"}
        // label={{
        //   text: "P",
        //   color: "white",
        // }}
        title={"Pickup Location"}
        icon={{
          url: pickupIcon,
        }}
        draggable={true}
        onDragend={(t, map, coord) => onPickupMarkerDragEnd(coord)}
      />
      {/* ) : (
        <div></div>
      )} */}

      {/* {state.dropoffMarker.lat ? ( */}
      <Marker
        position={{
          lat: state.dropoffMarker.lat,
          lng: state.dropoffMarker.lng,
        }}
        name={"Dropoff Location"}
        // label={{
        //   text: "P",
        //   color: "white",
        // }}
        title={"Dropoff Location"}
        icon={{
          url: dropoffIcon,
        }}
        draggable={true}
        onDragend={(t, map, coord) => onDropoffMarkerDragEnd(coord)}
      />
      {/* ) : (
        <div></div>
      )} */}
      <PlacesAutocomplete value={state.pickupAddress} onChange={handleChangePickup} onSelect={handlePickupSelect}>
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className={classes.placeInputDiv}>
            <input
              {...getInputProps({
                placeholder: "Search Pickup Location...",
                className: "location-search-input",
              })}
              className={classes.placeInput}
              value={pickupSearchBox ? pickupSearchBox.pickupAddress : ""}
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
