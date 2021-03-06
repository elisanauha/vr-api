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

      // Fetching data for Tampere (default in state) as example
      let search =
         "https://rata.digitraffic.fi/api/v1/live-trains/station/" +
         this.state.station +
         "?minutes_before_departure=400" +
         "&minutes_after_departure=0" +
         "&minutes_before_arrival=400" +
         "&minutes_after_arrival=0";
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
                  filteredData.push(train);
               }
            }
            // Now the trains have to be sorted
            let newtrains = sortTrains(
               filteredData,
               this.state.station,
               this.state.arriving
            );
            this.setState({ trains: newtrains });
         })
         .catch(error => console.error("Error:", error));
   }

   /**
    * When something is written in the search field the citysearch in state is changed.
    * Then a search is made in the stations to find the first station that starts with the searchTerm.
    * The timetable of this city is fetched from the digitraffic API and put on the screen.
    * @param {input onChange} event
    */
   handleSearch(event) {
      let newsearchterm = event.target.value;

      // Searching through the stations to get first station starting with the searchTerm text
      let matchingStation = this.state.station;
      let matchingStationFull = this.state.stationFull;
      for (let station of this.state.stations) {
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

      // Now fetching the trains for the matchingStation if station has actually changed
      // TODO: The minutes before and after arrival or departure could be set with some logic (now 8 hours)
      if (matchingStation !== this.state.station) {
         let search =
            "https://rata.digitraffic.fi/api/v1/live-trains/station/" +
            matchingStation +
            "?minutes_before_departure=480" +
            "&minutes_after_departure=0" +
            "&minutes_before_arrival=480" +
            "&minutes_after_arrival=0";
         fetch(search)
            .then(response => response.json())
            .then(data => {
               // filter by trainCategory - we want "Long-distance" and "Commuter", not "Cargo" etc.
               let filteredTrains = [];
               for (let train of data) {
                  if (
                     train.trainCategory === "Long-distance" ||
                     train.trainCategory === "Commuter"
                  ) {
                     // TODO: Would be nice to filter out all the extra stations in timeTableRows
                     // as only need the ones for the current station !and the first and last!
                     // train.timeTableRows = train.timeTableRows.filter(
                     //    row => row.stationShortCode === this.state.station
                     // );
                     filteredTrains.push(train);
                  }
               }
               // Now the trains have to be sorted
               let newtrains = sortTrains(
                  filteredTrains,
                  matchingStation,
                  this.state.arriving
               );
               //console.log(filteredData);
               this.setState({ trains: newtrains });
            })
            .catch(error => console.error("Error:", error));
      }

      this.setState(newstate);
   }

   /**
    * When clicking on the tabs the state indicating if arriving or departing trains are wanted is changed
    * and the trains have to be sorted according to arrival or departure time
    * @param {button onClick} event
    */
   handleTabChange(event) {
      let arriving = false;
      if (event.target.id === "arriving") {
         arriving = true;
      }

      // Trains also have to be sorted by arrival or departure time
      // make a copy of the trains, sort and put in state
      let newtrains = JSON.parse(JSON.stringify(this.state.trains));
      newtrains = sortTrains(newtrains, this.state.station, arriving);

      this.setState({ arriving: arriving, trains: newtrains });
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
               stations={this.state.stations}
            />
         </div>
      );
   }
}

export default App;

/**
 * Helpers for sorting the trains according to arrival or departure from specified station when needed
 * TODO: the sorting doesn't always work properly - something to do with the dates and times and most visible
 * in helsinki with a lot of trains on the list.
 * @param {*} trains
 * @param {*} currentStation
 * @param {*} arriving
 */
function sortTrains(trains, currentStation, arriving) {
   // Comparison functions to sort trains according to arrival or departure time at specified station.
   function dateCompareArriving(a, b) {
      let timea = getScheduledTime(a, "ARRIVAL");
      let timeb = getScheduledTime(b, "ARRIVAL");
      let datea = new Date(timea);
      let dateb = new Date(timeb);
      return datea - dateb;
   }

   function dateCompareDeparting(a, b) {
      let timea = getScheduledTime(a, "DEPARTURE");
      let timeb = getScheduledTime(b, "DEPARTURE");
      let datea = new Date(timea);
      let dateb = new Date(timeb);
      return datea - dateb;
   }

   function getScheduledTime(train, departingOrArriving) {
      let time = "";
      for (let row of train.timeTableRows) {
         if (
            row.stationShortCode === currentStation &&
            row.type === departingOrArriving
         ) {
            time = row.scheduledTime;
            break;
         }
      }
      return time;
   }

   if (arriving) {
      // sort with arriving time
      trains.sort(dateCompareArriving);
   } else {
      // sort with departure time
      trains.sort(dateCompareDeparting);
   }
   //console.log(trains);
   return trains;
}
