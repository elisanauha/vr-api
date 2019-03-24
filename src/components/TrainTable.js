import React, { Component } from "react";
import TrainRows from "./TrainRows";

class TrainTable extends Component {
   constructor(props) {
      super(props);
   }

   render() {
      let station = this.props.station;

      // Comparsison functions to sort trains according to arrival or departure time at specified station.
      // TODO: check when the sorting is done as first render not sorted!!
      function dateCompareArriving(a, b) {
         let timea = "";
         let timeb = "";
         for (let rowa of a.timeTableRows) {
            if (rowa.stationShortCode === station && rowa.type === "ARRIVAL") {
               timea = rowa.scheduledTime;
               break;
            }
         }
         for (let rowb of b.timeTableRows) {
            if (rowb.stationShortCode === station && rowb.type === "ARRIVAL") {
               timeb = rowb.scheduledTime;
               break;
            }
         }
         let datea = new Date(timea);
         let dateb = new Date(timeb);
         return datea - dateb;
      }

      function dateCompareDeparting(a, b) {
         let timea = "";
         let timeb = "";
         for (let rowa of a.timeTableRows) {
            if (
               rowa.stationShortCode === station &&
               rowa.type === "DEPARTURE"
            ) {
               timea = rowa.scheduledTime;
               break;
            }
         }
         for (let rowb of b.timeTableRows) {
            if (
               rowb.stationShortCode === station &&
               rowb.type === "DEPARTURE"
            ) {
               timeb = rowb.scheduledTime;
               break;
            }
         }
         let datea = new Date(timea);
         let dateb = new Date(timeb);
         return datea - dateb;
      }

      // Checking if departure or arrival column is wanted
      // Trains also have to be sorted by arrival or departure time
      let timeColumn = "";
      if (this.props.arrivingTab) {
         timeColumn = "Saapuu";
         // sort with arriving time
         this.props.trains.sort(dateCompareArriving);
      } else {
         timeColumn = "Lähtee";
         // sort with departure time
         this.props.trains.sort(dateCompareDeparting);
      }

      let trainrows = [];
      let i = 1; // keep track of even or odd

      for (let train of this.props.trains) {
         // If departures are wanted but the trains final destination is the current city then the row is not wanted
         // If arrivals are wanted but the first station is the station wanted then row is not wanted
         // ie. no one cares when the train comes or goes from "storage"
         if (
            (this.props.arrivingTab && // is arriving
               train.timeTableRows[0].stationShortCode ===
                  this.props.station) || // station is first station
            (!this.props.arrivingTab && // is departing
               train.timeTableRows[train.timeTableRows.length - 1]
                  .stationShortCode === this.props.station) // station is final station
         );
         else {
            trainrows.push(
               <TrainRows
                  train={train}
                  i={i}
                  station={this.props.station}
                  arrivingTab={this.props.arrivingTab}
                  key={i}
               />
            );
            i++;
         }
      }

      return (
         <div className="TrainTable">
            <table>
               <tbody>
                  <tr className="HeaderRow">
                     <th>Juna</th>
                     <th>Lähtöasema</th>
                     <th>Pääteasema</th>
                     <th>{timeColumn}</th>
                  </tr>
                  {trainrows}
               </tbody>
            </table>
         </div>
      );
   }
}

export default TrainTable;
