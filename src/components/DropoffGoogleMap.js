import { Map, Marker, GoogleApiWrapper, fitBounds } from "google-maps-react";
import React, { useContext, useEffect, useState, useRef } from "react";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { makeStyles } from "@material-ui/core";
import { SharedContext } from "../utils/common";
import dropoffIcon from "../assets/icons/mapicon/darkgreen_MarkerD.png";
import pickupIcon from "../assets/icons/mapicon/red_MarkerP.png";
import Geocode from "react-geocode";
import { isNumber } from "lodash";
import { isRequired } from "../utils/validators";
import { Typography } from "@material-ui/core";

// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
Geocode.setApiKey("AIzaSyDQiv46FsaIrqpxs4PjEpQYTEncAUZFYlU");

// set response language. Defaults to english.
Geocode.setLanguage("en");

// set response region. Its optional.
// A Geocoding request with region=es (Spain) will return the Spanish city.
Geocode.setRegion("pk");
Geocode.enableDebug();

const searchOptions = {
  componentRestrictions: { country: ["pk"] },
};

const useStyles = makeStyles((theme) => ({
  singleInputDiv: {
    position: "absolute",
    zIndex: 100,
    top: "80%",
    left: "45%",
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
    // position: "relative",
    // bottom: "200px",
  },
}));

function DropoffGoogleMap(props) {
  const {
    setSingleLocationLatlng,
    setSingleLocationAddress,
    singleLocationLatlng,
    showSingleSearchField,
    setDropoffAddress,
    checkValidation,
    singleLocationAddress,
  } = props;

  const classes = useStyles();
  const input = useRef(Map);

  const [singleLocationSearchBox, setSingleLocationSearchBox] = useState(singleLocationAddress || ""); // for dropoff locations value
  const [zoom, setZoom] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [state, setState] = useState({
    mapCenter: singleLocationLatlng
      ? singleLocationLatlng
      : {
          lat: 30.2919928,
          lng: 64.8560693,
        },
    zoom: zoom ? zoom : 4.5,
  });

  const handleChangeSingleLocation = async (singleLocationSearchBox) => {
    setSingleLocationSearchBox(singleLocationSearchBox);
    // setState({ ...state, singleLocationSearchBox });
  };

  const handleSingleLocationSelect = (singleLocationAddress) => {
    geocodeByAddress(singleLocationAddress)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        let zoom, mapCenter;
        if (state.singleLocationMarker && state.singleLocationMarker.lat && state.singleLocationMarker.lng) {
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
        setDropoffAddress(singleLocationAddress); // field of dropoff in parent
        setSingleLocationAddress(singleLocationAddress); // local text box of google map
      });
    if (setSingleLocationSearchBox) setSingleLocationSearchBox(singleLocationAddress);
  };

  useEffect(async () => {
    if (singleLocationLatlng) {
      const address = await reverseGeocoding(singleLocationLatlng);
      setSingleLocationSearchBox(address);
    }
  }, [singleLocationLatlng]);

  useEffect(() => {
    setSingleLocationSearchBox(singleLocationAddress);
  }, [singleLocationAddress]);

  const reverseGeocoding = async (latlng) => {
    if (isNumber(latlng.lat) && isNumber(latlng.lng)) {
      const response = await Geocode.fromLatLng(latlng.lat, latlng.lng);
      const address = response.results[0].formatted_address;
      return address;
    }
    return null;
  };

  const onSingleLocationMarkerDragEnd = async (coord) => {
    const { latLng } = coord;
    const updatedLat = latLng.lat();
    const updatedLng = latLng.lng();
    const addr = await reverseGeocoding({ lat: latLng.lat(), lng: latLng.lng() });

    setSingleLocationSearchBox(addr);
    setSingleLocationAddress(addr);
    setDropoffAddress(addr);

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

  return (
    <Map
      google={props.google}
      // initialCenter={{
      //     lat: state.pickupMarker.lat,
      //     lng: state.pickupMarker.lng,
      // }}
      center={{
        lat: singleLocationLatlng && singleLocationLatlng.lat ? singleLocationLatlng.lat : state.mapCenter.lat,
        lng: singleLocationLatlng && singleLocationLatlng.lng ? singleLocationLatlng.lng : state.mapCenter.lng,
      }}
      zoom={state.zoom}
      style={{ position: "relative", height: "100%" }}
      streetViewControl={false}
      ref={input}
    >
      {isRequired(singleLocationSearchBox) ? (
        <Marker
          position={{
            lat: singleLocationLatlng ? singleLocationLatlng.lat : state.mapCenter.lat,
            lng: singleLocationLatlng ? singleLocationLatlng.lng : state.mapCenter.lng,
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
          onDragend={(t, map, coord) => onSingleLocationMarkerDragEnd(coord)}
        />
      ) : (
        ""
      )}

      <PlacesAutocomplete
        searchOptions={searchOptions}
        value={singleLocationSearchBox}
        onChange={handleChangeSingleLocation}
        onSelect={handleSingleLocationSelect}
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
            <div className="autocomplete-dropdown-container">
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
      {checkValidation ? <Typography color="error">Dropoff Location is required!</Typography> : ""}
    </Map>
  );
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyC3T1GyCUwIoVxeQYrrC_SLGck_weIh8ts",
})(DropoffGoogleMap);
