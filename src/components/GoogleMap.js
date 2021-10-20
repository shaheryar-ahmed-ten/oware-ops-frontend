import { Map, Marker, GoogleApiWrapper, fitBounds } from "google-maps-react";
import React, { useContext, useEffect, useState, useRef } from "react";
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
  const input = useRef(Map);
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
      lat: 30.2919928,
      lng: 64.8560693,
    },
    zoom: 5.5,
  });
  const bounds = new props.google.maps.LatLngBounds();
  const bounds2 = new props.google.maps.LatLngBounds();
  bounds.extend(new props.google.maps.LatLng(state.pickupMarker.lat, state.pickupMarker.lng));
  bounds2.extend(new props.google.maps.LatLng(state.pickupMarker.lat, state.pickupMarker.lng));

  const [pickupSearchBox, setpickupSearchBox] = useState("");
  const [dropoffSearchBox, setDropoffSearchBox] = useState("");

  const sharedContext = useContext(SharedContext);

  useEffect(() => {
    sharedContext.setSelectedMapLocation(state.pickupMarker);
  }, [state.pickupMarker]);

  const handleChangePickup = (pickupAddress) => {
    setState({ ...state, pickupAddress });
    setpickupSearchBox(pickupAddress);
  };

  const handleChangeDropoff = (dropoffAddress) => {
    setState({ ...state, dropoffAddress });
    setDropoffSearchBox(dropoffAddress);
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
          mapCenter: { lat: latLng.lat, lng: latLng.lng },
          zoom: 14,
          bounds: { bounds },
        });
        setPickUp({
          lat: latLng.lat,
          lng: latLng.lng,
        });
        setpickupSearchBox(pickupAddress);
      })
      .catch((error) => console.error("Error", error));
  };

  const calcZoomAndMapCenter = (pickup, dropoff) => {
    const midPointLat = (pickup.lat + dropoff.lat) / 2;
    const midPointLng = (pickup.lng + dropoff.lng) / 2;
    const zoom = { lat: midPointLat, lng: midPointLng };
    return { zoom, center: null };
  };
  const handleDropoffSelect = (dropoffAddress) => {
    geocodeByAddress(dropoffAddress)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        const { zoom, center } = calcZoomAndMapCenter(state.pickupMarker, state.dropoffMarker);
        console.log("zoom, center", zoom, center);
        setState({
          ...state,
          dropoffMarker: {
            lat: latLng.lat,
            lng: latLng.lng,
          },
          mapCenter: {
            lat: 30.2919928,
            lng: 64.8560693,
          },
          bounds: { bounds2 },
          zoom: 14,
        });

        setDropOff({
          lat: latLng.lat,
          lng: latLng.lng,
        });
      });
    if (setDropoffSearchBox) setDropoffSearchBox(dropoffAddress);
  };

  const onPickupMarkerDragEnd = (coord) => {
    const { latLng } = coord;
    const updatedLat = latLng.lat();
    const updatedLng = latLng.lng();

    setState({
      ...state,
      pickupMarker: {
        lat: updatedLat,
        lng: updatedLng,
      },
      zoom: 14,
    });

    console.log("state.pickupMarker OLD", state.pickupMarker, "new date", new Date());
    return { lat: updatedLat, lng: updatedLng };
  };

  const onDropoffMarkerDragEnd = (coord) => {
    const { latLng } = coord;
    const updatedLat = latLng.lat();
    const updatedLng = latLng.lng();
    setState({
      ...state,
      dropoffMarker: {
        lat: updatedLat,
        lng: updatedLng,
      },
      zoom: 14,
    });
    return { lat: updatedLat, lng: updatedLng };
  };

  useEffect(() => {
    if (setPickUp) setPickUp(state.pickupMarker);
    if (setDropOff) setDropOff(state.dropoffMarker);
  }, [state.pickupMarker, state.dropoffMarker]);

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
      ref={input}
    >
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
      {props.showMapSearchFields ? (
        <div>
          <PlacesAutocomplete value={pickupSearchBox} onChange={handleChangePickup} onSelect={handlePickupSelect}>
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
              <div className={classes.placeInputDiv}>
                <input
                  {...getInputProps({
                    placeholder: "Search Pickup Location...",
                    className: "location-search-input",
                  })}
                  className={classes.placeInput}
                  value={pickupSearchBox}
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
          <PlacesAutocomplete value={dropoffSearchBox} onChange={handleChangeDropoff} onSelect={handleDropoffSelect}>
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
              <div className={classes.placeDropoffInputDiv}>
                <input
                  {...getInputProps({
                    placeholder: "Search Dropoff Location...",
                    className: "location-search-input",
                  })}
                  className={classes.placeInput}
                  value={dropoffSearchBox}
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
        </div>
      ) : (
        <div></div>
      )}
    </Map>
  );
}

// export default GoogleMap
export default GoogleApiWrapper({
  apiKey: "AIzaSyC3T1GyCUwIoVxeQYrrC_SLGck_weIh8ts",
})(GoogleMap);
