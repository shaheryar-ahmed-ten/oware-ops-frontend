import Geocode from "react-geocode";

// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
Geocode.setApiKey("AIzaSyDQiv46FsaIrqpxs4PjEpQYTEncAUZFYlU");

// set response language. Defaults to english.
Geocode.setLanguage("en");

// set response region. Its optional.
// A Geocoding request with region=es (Spain) will return the Spanish city.
Geocode.setRegion("pk");
Geocode.enableDebug();

const reverseGeocoding = async (latlng) => {
  if (latlng && latlng.lat && latlng.lng) {
    const response = await Geocode.fromLatLng(latlng.lat, latlng.lng);
    const address = response.results[0].formatted_address;
    return address;
  }
  return null;
};

export default reverseGeocoding;
