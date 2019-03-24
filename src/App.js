import React, { Component } from "react";

import "./App.css";
import HeaderPanel from "./components/HeaderPanel";
import SearchPanel from "./components/SearchPanel";
import TrainTabs from "./components/TrainTabs";

class App extends Component {
   constructor(props) {
      super(props);

      this.state = {
         stations: null,
         searchTerm: "Tampere",
         station: "TPE",
         stationFull: "Tampere asema",
         arriving: true,
         trains: []
      };

      this.handleSearch = this.handleSearch.bind(this);
      this.handleTabChange = this.handleTabChange.bind(this);
   }

   /**
    * Fetching the station data only when the app mounts as it is likely not going to change
    * Fetching original data for a station (Tampere)
    */
   componentDidMount() {
      // Need to get the station data for searching to get stationShortCode
      fetch("https://rata.digitraffic.fi/api/v1/metadata/stations")
         .then(response => response.json())
         .then(data => {
            // Filtering out stations that do not have passanger traffic as expected
            // to only want data on passanger trains
            let filteredData = [];
            for (let station of data) {
               if (station.passengerTraffic) {
                  filteredData.push(station);
               }
            }

            this.setState({ stations: filteredData });
            //console.log(filteredData);
         });

      let search =
         "https://rata.digitraffic.fi/api/v1/live-trains/station/" +
         this.state.station +
         "?minutes_before_departure=400" +
         "&minutes_after_departure=1" +
         "&minutes_before_arrival=400" +
         "&minutes_after_arrival=1";
      fetch(search)
         .then(response => response.json())
         .then(data => {
            // filter by trainCategory - we want "Long-distance" and "Commuter", not "Cargo" etc.
            let filteredData = [];
            for (let train of data) {
               if (
                  train.trainCategory === "Long-distance" ||
                  train.trainCategory === "Commuter"
               ) {
                  // Would be nice to filtering out all the extra stations in the time table as only
                  // need the ones for the current station !and the first and last! TODO: check
                  // train.timeTableRows = train.timeTableRows.filter(
                  //    row => row.stationShortCode === this.state.station
                  // );

                  filteredData.push(train);
               }
            }
            console.log(filteredData);
            this.setState({ trains: filteredData });
         });
   }

   /**
    * When something is written in the search field the citysearch in state is changed.
    * Then a search is made in the stations to find the first station that starts with the searchTerm.
    * The timetable of this city is fetched from the digitraffic API and put on the screen.
    */
   handleSearch(event) {
      let newsearchterm = event.target.value;

      // Searching through the stations to get first station starting with the searchTerm text
      let matchingStation = this.state.station;
      let matchingStationFull = this.state.stationFull;
      for (let station of this.state.stations) {
         console.log(station.stationName);
         if (
            station.stationName
               .toLowerCase()
               .startsWith(newsearchterm.toLowerCase())
         ) {
            matchingStation = station.stationShortCode;
            matchingStationFull = station.stationName;
            break;
         }
      }
      // Setting the new state with searchTerm and station to display
      let newstate = {
         searchTerm: newsearchterm,
         station: matchingStation,
         stationFull: matchingStationFull
      };

      this.setState(newstate);

      // Now fetching the trains for the matchingStation
      let search =
         "https://rata.digitraffic.fi/api/v1/live-trains/station/" +
         matchingStation +
         "?minutes_before_departure=400" +
         "&minutes_after_departure=1" +
         "&minutes_before_arrival=400" +
         "&minutes_after_arrival=1";
      fetch(search)
         .then(response => response.json())
         .then(data => {
            // filter by trainCategory - we want "Long-distance" and "Commuter", not "Cargo" etc.
            let filteredData = [];
            for (let train of data) {
               if (
                  train.trainCategory === "Long-distance" ||
                  train.trainCategory === "Commuter"
               ) {
                  // Would be nice to filtering out all the extra stations in the time table as only
                  // need the ones for the current station !and the first and last! TODO: check
                  // train.timeTableRows = train.timeTableRows.filter(
                  //    row => row.stationShortCode === this.state.station
                  // );

                  filteredData.push(train);
               }
            }
            console.log(filteredData);
            this.setState({ trains: filteredData });
         }); // TODO .catch()
   }

   handleTabChange(event) {
      console.log(event.target.id);
      let arriving = false;
      if (event.target.id === "arriving") {
         arriving = true;
      }

      this.setState({ arriving: arriving });
   }

   render() {
      return (
         <div className="App">
            <HeaderPanel />
            <SearchPanel
               onSearchChange={this.handleSearch}
               searchTerm={this.state.searchTerm}
               stationFull={this.state.stationFull}
            />
            <TrainTabs
               arrivingTab={this.state.arriving}
               onTabChange={this.handleTabChange}
               trains={this.state.trains}
               station={this.state.station}
            />
         </div>
      );
   }
}

export default App;
