import { Map, Marker, GoogleApiWrapper, fitBounds } from "google-maps-react";
import React, { useContext, useEffect, useState, useRef } from "react";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { makeStyles } from "@material-ui/core";
import { SharedContext } from "../utils/common";
import dropoffIcon from "../assets/mapicon/darkgreen_MarkerD.png";
import pickupIcon from "../assets/mapicon/red_MarkerP.png";

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
    left: "20%",
    [theme.breakpoints.up("md")]: {
      width: "25%",
    },
    [theme.breakpoints.down("md")]: {
      width: "40%",
    },
    transform: "translateX(-50%)",
    fontSize: 12,
    color: "black",
  },
  placeDropoffInputDiv: {
    position: "absolute",
    zIndex: 100,
    top: "80%",
    left: "80%",
    [theme.breakpoints.up("md")]: {
      width: "25%",
    },
    [theme.breakpoints.down("md")]: {
      width: "40%",
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
  const input = useRef(Map);
  console.log("input", input);
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

  const calcZoomAndMapCenter = (pickup, dropoff) => {
    let zoom = null;
    if (Math.abs(pickup.lat - dropoff.lat) > 17 || Math.abs(pickup.lng - dropoff.lng) > 17) {
      zoom = 1;
    } else if (Math.abs(pickup.lat - dropoff.lat) > 14 || Math.abs(pickup.lng - dropoff.lng) > 14) {
      zoom = 2;
    } else if (Math.abs(pickup.lat - dropoff.lat) > 11.8 || Math.abs(pickup.lng - dropoff.lng) > 11.8) {
      zoom = 4;
    } else if (Math.abs(pickup.lat - dropoff.lat) > 8 || Math.abs(pickup.lng - dropoff.lng) > 8) {
      zoom = 4;
    } else if (Math.abs(pickup.lat - dropoff.lat) > 4 || Math.abs(pickup.lng - dropoff.lng) > 4) {
      zoom = 6;
    } else if (Math.abs(pickup.lat - dropoff.lat) > 3 || Math.abs(pickup.lng - dropoff.lng) > 3) {
      zoom = 7;
    } else if (Math.abs(pickup.lat - dropoff.lat) > 2 || Math.abs(pickup.lng - dropoff.lng) > 2) {
      zoom = 8;
    } else if (Math.abs(pickup.lat - dropoff.lat) > 0.5 || Math.abs(pickup.lng - dropoff.lng) > 0.5) {
      zoom = 8;
    } else if (Math.abs(pickup.lat - dropoff.lat) > 0.1 || Math.abs(pickup.lng - dropoff.lng) > 0.1) {
      zoom = 10;
    } else if (Math.abs(pickup.lat - dropoff.lat) > 0.06 || Math.abs(pickup.lng - dropoff.lng) > 0.06) {
      zoom = 11;
    } else if (Math.abs(pickup.lat - dropoff.lat) > 0.04 || Math.abs(pickup.lng - dropoff.lng) > 0.04) {
      zoom = 12;
    } else if (Math.abs(pickup.lat - dropoff.lat) > 0.025 || Math.abs(pickup.lng - dropoff.lng) > 0.025) {
      zoom = 13;
    } else if (Math.abs(pickup.lat - dropoff.lat) > 0.01 || Math.abs(pickup.lng - dropoff.lng) > 0.01) {
      zoom = 14;
    }
    const midPointLat = (pickup.lat + dropoff.lat) / 2;
    const midPointLng = (pickup.lng + dropoff.lng) / 2;
    const mapCenter = { lat: midPointLat, lng: midPointLng };
    return { mapCenter, zoom };
  };
  const handlePickupSelect = (pickupAddress) => {
    geocodeByAddress(pickupAddress)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        let zoom, mapCenter;
        if (state.dropoffMarker.lat && state.dropoffMarker.lng) {
          let calc = calcZoomAndMapCenter(
            {
              lat: latLng.lat,
              lng: latLng.lng,
            },
            state.dropoffMarker
          );
          zoom = calc.zoom;
          mapCenter = calc.mapCenter;
        }
        setState({
          ...state,
          pickupMarker: {
            lat: latLng.lat,
            lng: latLng.lng,
          },
          mapCenter: mapCenter
            ? mapCenter
            : {
                lat: latLng.lat,
                lng: latLng.lng,
              },
          zoom: zoom ? zoom : 14,
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
        let zoom, mapCenter;
        if (state.pickupMarker.lat && state.pickupMarker.lng) {
          let calc = calcZoomAndMapCenter(state.pickupMarker, {
            lat: latLng.lat,
            lng: latLng.lng,
          });
          zoom = calc.zoom;
          mapCenter = calc.mapCenter;
        }

        setState({
          ...state,
          dropoffMarker: {
            lat: latLng.lat,
            lng: latLng.lng,
          },
          mapCenter: mapCenter
            ? mapCenter
            : {
                lat: latLng.lat,
                lng: latLng.lng,
              },
          zoom: zoom ? zoom : 14,
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
      mapCenter: {
        lat: updatedLat,
        lng: updatedLng,
      },
      zoom: 14,
    });

    return { lat: updatedLat, lng: updatedLng };
  };

  const onDropoffMarkerDragEnd = (coord) => {
    const { latLng } = coord;
    console.log("PlacesAutocomplete", PlacesAutocomplete);
    const updatedLat = latLng.lat();
    const updatedLng = latLng.lng();
    setState({
      ...state,
      dropoffMarker: {
        lat: updatedLat,
        lng: updatedLng,
      },
      mapCenter: {
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
      {state.pickupMarker.lat && state.pickupMarker.lng ? (
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
      ) : (
        <div></div>
      )}

      {state.dropoffMarker.lat && state.dropoffMarker.lng ? (
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
      ) : (
        <div></div>
      )}
      {props.showMapSearchFields ? (
        <div>
          <PlacesAutocomplete
            value={pickupSearchBox}
            onChange={handleChangePickup}
            onSelect={handlePickupSelect}
            style={{ width: "50%" }}
          >
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
          <PlacesAutocomplete
            value={dropoffSearchBox}
            onChange={handleChangeDropoff}
            onSelect={handleDropoffSelect}
            style={{ width: "50%" }}
          >
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
