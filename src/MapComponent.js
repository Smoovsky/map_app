import React from 'react';
import {compose, withProps, lifecycle} from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, DirectionsRenderer  } from "react-google-maps";


//function makes api to google map based on location
function requestRoute(locations, distNotify){
  const google = window.google;
  let directionsService = new google.maps.DirectionsService();

  let waypoints = [...locations];
  waypoints.splice(waypoints.length - 1, 1);
  waypoints.splice(0, 1);

  waypoints = waypoints.map(x => ({location:x}));

  let query = {
    origin: locations[0],
    destination: locations[locations.length - 1],
    travelMode: 'DRIVING',
    waypoints: waypoints
  };

  directionsService.route(query, (result, status) => {
    if (status == 'OK') {
      let dist = tallyDist(result.routes[0].legs);
      distNotify(dist);
      this.setState({
        directions: result
      });
    }
  });

}

//calculate total distance of all legs in route object 
function tallyDist(legs){
  let dist = 0;
  for(let leg of legs){
    dist += leg.distance.value;
  }
  return dist;
}

//make map bounds to fit a set of markers(locations)
function mapZoomFit(map, markers){
  if(map) {
    const google = window.google;

    let bounds = new google.maps.LatLngBounds();
    for(const marker of markers){
      
      bounds.extend(marker);
    }
    map.fitBounds(bounds);
  };
}

//recompose is utilized to configure google map component and to provide lifecycle management for
//map component which is by default a pure component
const mapComponent = compose(
    withProps({
      googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyAcUtsavPhlJKS70a3_AKI_bOFDuiUIvyY&v=3.exp&libraries=geometry,drawing,places",
      loadingElement: <div style={{ height: `100%` }} />,
      containerElement: <div style={{ height: `400px` }} />,
      mapElement: <div style={{ height: `100%` }} />,
    }),
    withScriptjs,
    withGoogleMap,
    lifecycle({
      //route is updated once a new set of locations is received from the parent
      componentDidMount() {
        let locations = this.props.markers;
        let distNotify = this.props.distNotify;
        this.requestRoute = requestRoute.bind(this);
        this.requestRoute(locations, distNotify);
      },
      componentDidUpdate(){
        let locations = this.props.markers;
        let distNotify = this.props.distNotify;
        this.requestRoute(locations, distNotify);
    }})
  )((props) =>
      {
        let markers = props.markers.map( (x, i) => <Marker position={x} key={i}/>);

        let mountHandler = (map) => {
          mapZoomFit(map, props.markers);
        };
          
        let googleMap = (
          <GoogleMap
            defaultZoom={8}
            defaultCenter={{ lat: -37.822066, lng: 144.963454 }}
            ref={mountHandler}
            >
              {markers}
              {props.directions && <DirectionsRenderer directions={props.directions} />}
            </GoogleMap>);
        
        return (
          googleMap
        );
      }
    
  );

export default mapComponent
