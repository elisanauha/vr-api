import React, { Component } from "react";
import TrainRows from "./TrainRows";

class TrainTable extends Component {
   render() {
      // Checking if departure or arrival column is wanted
      // Trains also have to be sorted by arrival or departure time
      let timeColumn = "";
      if (this.props.arrivingTab) {
         timeColumn = "Saapuu";
      } else {
         timeColumn = "Lähtee";
      }

      // Go through the trains and make a row for each.
      let trainrows = [];
      let i = 1; // keep track of even or odd

      for (let train of this.props.trains) {
         // If departures are wanted, but the trains final destination is the current station then the row is not wanted
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
                  stations={this.props.stations}
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
