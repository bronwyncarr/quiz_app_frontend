import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

function Map({ locations }) {
  // Selected location is once a user clicks on a ion, a info box will appear.
  const [selectedLocation, setSelectedLocation] = useState({});

  // To be refactored into styled components/css
  const mapStyles = {
    height: "500px",
    width: "1000px",
  };

  // // If current position is not available, default is MEL CBD.
  // const defaultCenter = {
  //   lat: -37.8136,
  //   lng: 144.9631,
  // };

  // Not sure if needs to be stored in state.
  const [currentPosition, setCurrentPosition] = useState({});
  function success(position) {
    const currentPosition = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    setCurrentPosition(currentPosition);
  }

  let mapCenter = { lat: 0, lng: 0 };

  function calculateCenter() {
    if (locations.length === 1) {
      mapCenter = { lat: locations[0].latitude, lng: locations[0].longitude };
    } else if (currentPosition.lat) {
      mapCenter = currentPosition;
    } else {
      mapCenter = { lat: -37.8136, lng: 144.9631 };
    }
  }
  calculateCenter();

  // On Page load,gwt position
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success);
  });

  console.log(locations);

  return (
    locations && (
      <LoadScript googleMapsApiKey={`${process.env.REACT_APP_MAPS_API_KEY}`}>
        {/* Map itself */}
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={13}
          // If location lat (ie coordinates) are available, centers on location, otherwise centers on Melbourne city
          center={mapCenter}
        >
          {/* Markers on the map for each location */}
          {locations?.length > 0 &&
            locations.map((item) => {
              return (
                <Marker
                  key={item.name}
                  position={{ lat: item.latitude, lng: item.longitude }}
                  onClick={() => setSelectedLocation(item)}
                />
              );
            })}

          {/* If user clicks on a location, dialogue box pops up with info and link to show page */}
          {selectedLocation.latitude && (
            <InfoWindow
              position={{
                lat: selectedLocation.latitude,
                lng: selectedLocation.longitude,
              }}
              clickable={true}
              onCloseClick={() => setSelectedLocation({})}
            >
              <>
                <p>{selectedLocation.name}</p>
                <Link to={`/locations/${selectedLocation.id}`}>
                  Show details
                </Link>
              </>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    )
  );
}

export default Map;
