import { Map, Marker, GoogleApiWrapper, fitBounds } from "google-maps-react";
import React, { useContext, useEffect, useState, useRef } from "react";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { makeStyles } from "@material-ui/core";
import { SharedContext } from "../utils/common";
import dropoffIcon from "../assets/icons/mapicon/darkgreen_MarkerD.png";
import pickupIcon from "../assets/icons/mapicon/red_MarkerP.png";
import Geocode from "react-geocode";
import { isNumber } from "lodash";

// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
Geocode.setApiKey("AIzaSyDQiv46FsaIrqpxs4PjEpQYTEncAUZFYlU");

// set response language. Defaults to english.
Geocode.setLanguage("en");

// set response region. Its optional.
// A Geocoding request with region=es (Spain) will return the Spanish city.
Geocode.setRegion("pk");
Geocode.enableDebug();

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
    width: "150%",
    position: "absolute",
    zIndex: 100,
    top: "130%",
    left: "45%",
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
  singleInputDiv: {
    position: "absolute",
    zIndex: 100,
    top: "145%",
    left: "50%",
    [theme.breakpoints.up("md")]: {
      width: "70%",
    },
    [theme.breakpoints.down("md")]: {
      width: "100%",
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
    position: "relative",
    bottom: "200px",
  },
}));

function GoogleMap(props) {
  const reverseGeocoding = async (latlng) => {
    if (isNumber(latlng.lat) && isNumber(latlng.lng)) {
      const response = await Geocode.fromLatLng(latlng.lat, latlng.lng);
      const address = response.results[0].formatted_address;
      return address;
    }
    return null;
  };
  const classes = useStyles();
  const input = useRef(Map);

  const calcZoomAndMapCenter = (pickup, dropoff) => {
    let zoom = null;
    if (Math.abs(pickup.lat - dropoff.lat) > 17 || Math.abs(pickup.lng - dropoff.lng) > 17) {
      zoom = 1.5;
    } else if (Math.abs(pickup.lat - dropoff.lat) > 14 || Math.abs(pickup.lng - dropoff.lng) > 14) {
      zoom = 2.5;
    } else if (Math.abs(pickup.lat - dropoff.lat) > 11.8 || Math.abs(pickup.lng - dropoff.lng) > 11.8) {
      zoom = 4.5;
    } else if (Math.abs(pickup.lat - dropoff.lat) > 8 || Math.abs(pickup.lng - dropoff.lng) > 8) {
      zoom = 4.5;
    } else if (Math.abs(pickup.lat - dropoff.lat) > 4 || Math.abs(pickup.lng - dropoff.lng) > 4) {
      zoom = 5.25;
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
  const {
    setDropOff,
    setPickUp,
    pickupLocation,
    dropoffLocation,
    setPickupAddress,
    setDropoffAddress,
    setSingleLocationLatlng,
    singleLocationLatlng,
    setSingleLocationAddress,
    showPickupOnly,
    editable,
  } = props;

  const [pickupSearchBox, setpickupSearchBox] = useState("");
  const [dropoffSearchBox, setDropoffSearchBox] = useState("");
  const [singleLocationSearchBox, setSingleLocationSearchBox] = useState("");

  let zoom, mapCenter;

  useEffect(() => {
    if (pickupLocation && pickupLocation.lat && dropoffLocation && dropoffLocation.lat) {
      const calc = calcZoomAndMapCenter(pickupLocation, dropoffLocation);
      zoom = calc.zoom;
      mapCenter = calc.mapCenter;
      setState({ ...state, zoom, mapCenter });
    }
    if (pickupLocation && pickupLocation.lat) {
      Geocode.fromLatLng(pickupLocation.lat, pickupLocation.lng)
        .then((addresses) => addresses.results[0].formatted_address)
        .then((result) => {
          setpickupSearchBox(result);
        });
    } else if (dropoffLocation && dropoffLocation.lat) {
      Geocode.fromLatLng(dropoffLocation.lat, dropoffLocation.lng)
        .then((addresses) => addresses.results[0].formatted_address)
        .then((result) => {
          setDropoffSearchBox(result);
        });
    } else if (singleLocationLatlng && singleLocationLatlng.lat) {
      setState({ ...state, zoom: 14, mapCenter: singleLocationLatlng });
      Geocode.fromLatLng(singleLocationLatlng.lat, singleLocationLatlng.lng)
        .then((addresses) => addresses.results[0].formatted_address)
        .then((result) => {
          setSingleLocationSearchBox(result);
        });
    }
  }, []);

  const [state, setState] = useState({
    pickupMarker: {
      lat: pickupLocation ? pickupLocation.lat : null,
      lng: pickupLocation ? pickupLocation.lng : null,
    },
    dropoffMarker: {
      lat: dropoffLocation ? dropoffLocation.lat : null,
      lng: dropoffLocation ? dropoffLocation.lng : null,
    },
    singleLocationMarker: {
      lat: singleLocationLatlng ? singleLocationLatlng.lat : null,
      lng: singleLocationLatlng ? singleLocationLatlng.lng : null,
    },
    mapCenter: mapCenter
      ? mapCenter
      : {
          lat: 30.2919928,
          lng: 64.8560693,
        },
    zoom: zoom ? zoom : 5.5,
  });

  const sharedContext = useContext(SharedContext);

  useEffect(() => {
    sharedContext.setSelectedMapLocation(state.pickupMarker);
  }, [state.pickupMarker]);

  const handleChangePickup = (pickupAddress) => {
    console.log(":- onchange,pickupAddress", pickupAddress);
    setState({ ...state, pickupAddress });
    setpickupSearchBox(pickupAddress);
    console.log(":- !!pickupAddress", !!pickupAddress);
    if (!!pickupAddress) {
      console.log(":- pickupAddress", pickupAddress);
      geocodeByAddress(pickupAddress)
        .then((results) => getLatLng(results[0]))
        .then((latLng) => {
          if (latLng.lat && latLng.lng) {
            console.log(":- debug1", {
              lat: latLng.lat,
              lng: latLng.lng,
            });
            // setPickUp({
            //   lat: latLng.lat,
            //   lng: latLng.lng,
            // });
          } else {
            console.log(":- debug2");
            setPickUp(null);
          }
        })
        .catch((err) => {
          console.log(":- err", err);
        });
    } else {
      setPickUp(null);
      console.log(":- debug 3\npickUp", props.pickUp);
    }
  };

  const handleChangeDropoff = (dropoffAddress) => {
    setState({ ...state, dropoffAddress });
    setDropoffSearchBox(dropoffAddress);
  };

  const handleChangeSingleLocation = async (singleLocationSearchBox) => {
    setState({ ...state, singleLocationSearchBox });
    setSingleLocationSearchBox(singleLocationSearchBox);
    setSingleLocationLatlng(
      reverseGeocoding(singleLocationSearchBox) ? await reverseGeocoding(singleLocationSearchBox) : null
    );
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
        if (latLng.lat && latLng.lng) {
          // setPickUp({
          //   lat: latLng.lat,
          //   lng: latLng.lng,
          // });
        } else {
          setPickUp(null);
        }
        setPickupAddress(pickupAddress);
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
        setDropoffAddress(dropoffAddress);
      });
    if (setDropoffSearchBox) setDropoffSearchBox(dropoffAddress);
  };

  const handleSingleLocationSelect = (singleLocationAddress) => {
    geocodeByAddress(singleLocationAddress)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        let zoom, mapCenter;
        if (state.singleLocationMarker.lat && state.singleLocationMarker.lng) {
          zoom = 14;
          mapCenter = state.singleLocationMarker;
        }

        setState({
          ...state,
          singleLocationMarker: {
            lat: latLng.lat,
            lng: latLng.lng,
          },
          mapCenter: {
            lat: latLng.lat,
            lng: latLng.lng,
          },
          zoom: zoom ? zoom : 14,
        });

        setSingleLocationLatlng({
          lat: latLng.lat,
          lng: latLng.lng,
        });
        setSingleLocationAddress(singleLocationAddress);
      });
    if (setSingleLocationSearchBox) setSingleLocationSearchBox(singleLocationAddress);
  };

  const onPickupMarkerDragEnd = async (coord) => {
    const { latLng } = coord;
    const updatedLat = latLng.lat();
    const updatedLng = latLng.lng();
    const addr = await reverseGeocoding({ lat: latLng.lat(), lng: latLng.lng() });
    setpickupSearchBox(addr);
    setPickupAddress(addr);

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

  const onDropoffMarkerDragEnd = async (coord) => {
    const { latLng } = coord;
    const updatedLat = latLng.lat();
    const updatedLng = latLng.lng();
    const addr = await reverseGeocoding({ lat: latLng.lat(), lng: latLng.lng() });
    setDropoffSearchBox(addr);
    setDropoffAddress(addr);
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

  const onSingleLocationMarkerDragEnd = async (coord) => {
    const { latLng } = coord;
    const updatedLat = latLng.lat();
    const updatedLng = latLng.lng();
    const addr = await reverseGeocoding({ lat: latLng.lat(), lng: latLng.lng() });
    setSingleLocationSearchBox(addr);
    setSingleLocationAddress(addr);
    setSingleLocationLatlng({
      lat: updatedLat,
      lng: updatedLng,
    });
    setState({
      ...state,
      singleLocationMarker: {
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
    if (state.pickupMarker.lat && state.pickupMarker.lng) {
      if (setPickUp) setPickUp(state.pickupMarker);
    } else {
      setPickUp(null);
    }
    if (setDropOff) setDropOff(state.dropoffMarker);
  }, [state.pickupMarker, state.dropoffMarker]);

  useEffect(() => {
    if (state.pickupMarker.lat && state.pickupMarker.lng) {
      // setPickUp(state.pickupMarker)
    } else setPickUp(null);
  }, [pickupSearchBox]);

  const searchOptions = {
    componentRestrictions: { country: ["pk"] },
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
      streetViewControl={false}
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
      {console.log("pickupSearch", pickupSearchBox)}
      {showPickupOnly ? (
        <PlacesAutocomplete
          searchOptions={searchOptions}
          value={pickupSearchBox}
          onChange={handleChangePickup}
          onSelect={handlePickupSelect}
          style={{ width: "50%" }}
          // onBlur={(e) => setValidation({ ...validation, pickUp: true })}
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
              <div
                className="autocomplete-dropdown-container"
                style={{ overflowY: "auto", maxHeight: 150, position: "relative", bottom: "200px" }}
              >
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
      ) : (
        ""
      )}

      {/* {props.showMapSearchFields ? (
        <div>
          <PlacesAutocomplete
            searchOptions={searchOptions}
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
                <div
                  className="autocomplete-dropdown-container"
                  style={{ overflowY: "auto", maxHeight: 150, position: "relative", bottom: "200px" }}
                >
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
            searchOptions={searchOptions}
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
                <div
                  className="autocomplete-dropdown-container"
                  style={{ overflowY: "auto", maxHeight: 150, position: "relative", bottom: "200px" }}
                >
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
      )} */}

      {state.singleLocationMarker.lat && state.singleLocationMarker.lng ? (
        <Marker
          position={{
            lat: state.singleLocationMarker.lat,
            lng: state.singleLocationMarker.lng,
          }}
          name={"Your Location"}
          title={"Your Location"}
          draggable={editable}
          onDragend={(t, map, coord) => onSingleLocationMarkerDragEnd(coord)}
        />
      ) : (
        <div></div>
      )}

      {/* Show single for warehouse */}
      {props.showSingleSearchField ? (
        <div>
          <PlacesAutocomplete
            searchOptions={searchOptions}
            value={singleLocationSearchBox}
            onChange={handleChangeSingleLocation}
            onSelect={handleSingleLocationSelect}
            style={{ width: "50%", margin: "auto", display: "block" }}
          >
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
              <div className={classes.singleInputDiv}>
                <input
                  {...getInputProps({
                    placeholder: "Select Location...",
                    className: "location-search-input",
                  })}
                  className={classes.placeInput}
                  value={singleLocationSearchBox}
                />
                <div
                  className="autocomplete-dropdown-container"
                  style={{ overflowY: "auto", maxHeight: 150, position: "relative", bottom: "200px" }}
                >
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
