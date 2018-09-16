import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MapComponent from './MapComponent';

class App extends Component {
  constructor(props){
    super(props);
    this.coordinateInputs = React.createRef();
  }

  state = {
    locations: [
      //hard-coded initial value
      {
        lat: -37.822066,
        lng: 144.963454,
      },
      {
        lat: -37.841936,
        lng: 144.935747,
      },
      {
        lat: -37.803082,
        lng: 144.862707,
      },
      {
        lat: -35.309049,
        lng: 149.108155,
      },
      {
        lat: -37.807772,
        lng: 145.059477,
      },
    ],
    distance: 0
  }

  //loop through all inputs and update map correspondingly
  updateMap = () => {
    let coordinates = [...this.coordinateInputs.current.children].map(
      (row) => {
        let coordinate = {};
        coordinate.lat = Number(row.children[0].children[0].children[1].children[0].value);
        coordinate.lng = Number(row.children[1].children[0].children[1].children[0].value);
        return coordinate;
      }
    );
    
    for(let x of coordinates){
      if(x.lat < -90 || x.lat > 90 || x.long > 180 || x.long < -180)
        return ;
    }

    this.setState({locations: coordinates});
  }

  //delete a location input
  deleteLocation = (location) => {
    this.setState(
      (state) => {
        let nextState = {...state};
        nextState.locations = nextState.locations.filter(x => x !== location);
        return nextState;
      }
    );
  }  
  
  addLocation = () => {
    this.setState(
      (state) => {
        let nextState = {...state};
        nextState.locations.push({lat:0, lng:0});
        //as this state is passed to a functional component as its props which won't update
        //if shallow comparison returns true, hence create a new array
        nextState.locations = [...nextState.locations]; 
        return nextState;
    });
  }

  updateDistance = (distance) => {
    this.setState({distance});
  }

  render() {
    return (
      <div className='container mt-3'>
        <div ref={this.coordinateInputs}>
          {
            this.state.locations.map(
              (x, i) => {
                return (
                  <div className='row' key={i}>
                    <div className='col-5 col-sm-5'>
                      <div className='form-group row'>
                        <label htmlFor="" className="col-3 col-form-label ">lat</label>
                        <div className="col-9">
                          <input type="text" className='form-control ' defaultValue={x.lat}/>
                        </div>
                      </div>
                    </div>
                    <div className='col-5 col-sm-5'>
                      <div className='form-group row'>
                        <label htmlFor="" className="col-3 col-form-label ">lng</label>
                        <div className="col-9">
                          <input type="text" className='form-control ' defaultValue={x.lng}/>
                        </div>
                      </div>
                    </div>
                    <div className="col-3 col-sm-2 ">
                      <button className="btn btn-danger mb-2 mb-sm-0" onClick={() => {this.deleteLocation(x)}}>Remove</button>
                    </div>
                  </div>
                )
              })
          }
        </div>
        <div style={{margin:'10px 0'}}>
          Total Distance: {Math.round(this.state.distance/1000)+'km'}
        </div>
        <button className="btn btn-success" onClick={this.addLocation}>Add Location</button>
        &nbsp;&nbsp;
        <button className="btn btn-primary" onClick={this.updateMap}>Update Map</button>
        <div style={{margin:'10px 0'}}>
        <MapComponent markers={this.state.locations} distNotify={this.updateDistance}/></div>
    </div>
    );
  }
}

export default App;
