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
         searchTerm: "",
         station: "",
         arriving: true
      };

      this.handleSearch = this.handleSearch.bind(this);
   }

   /**
    * Fetching the station data only when the app mounts as it is likely not going to change
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
   }

   /**
    * When something is written in the search field the citysearch in state is changed.
    * Then a search is made in the stations to find the first station that starts with the searchTerm.
    * The timetable of this city is fetched from the digitraffic API and put on the screen.
    */
   handleSearch(event) {
      let newsearchterm = event.target.value;

      // Searching through the stations to get first station starting with the searchTerm text
      let matchingStation = "";
      for (let station of this.state.stations) {
         console.log(station.stationName);
         if (
            station.stationName
               .toLowerCase()
               .startsWith(newsearchterm.toLowerCase())
         ) {
            matchingStation = station.stationShortCode;
            break;
         }
      }

      let newstate = {
         searchTerm: newsearchterm,
         station: matchingStation
      };

      this.setState(newstate);
   }

   render() {
      return (
         <div className="App">
            <HeaderPanel />
            <SearchPanel
               onSearchChange={this.handleSearch}
               searchTerm={this.state.searchTerm}
            />
            <TrainTabs />
         </div>
      );
   }
}

export default App;
