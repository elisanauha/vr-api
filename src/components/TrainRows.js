import React, { Component } from "react";

//import TrainTable from "./TrainTable";

class TrainRows extends Component {
   render() {
      let evenclass = "OddRow";
      if (this.props.i % 2 === 0) {
         evenclass = "EvenRow";
      }

      // if type is
      // type: "ARRIVAL" or type: "DEPARTURE"
      // liveEstimateTime: "2019-03-23T18:50:00.000Z"
      // scheduledTime: "2019-03-23T18:50:00.000Z"

      let train = this.props.train;
      let timeScheduled = "";
      let timeEstimated = [];
      // Checking if departure or arrival times are wanted
      if (this.props.arrivingTab) {
         // Arrivals are wanted
         for (let row of train.timeTableRows) {
            if (
               row.type === "ARRIVAL" &&
               row.stationShortCode === this.props.station
            ) {
               timeScheduled = row.scheduledTime.slice(11, 16);
               if (row.differenceInMinutes > 0) {
                  //timeEstimated.push(row.liveEstimateTime.slice(11, 16));
                  timeEstimated.push(<br key="br" />);
               }
            }
         }
      } else {
         // Departures are wanted
         for (let row of train.timeTableRows) {
            if (
               row.type === "DEPARTURE" &&
               row.stationShortCode === this.props.station
            ) {
               timeScheduled = row.scheduledTime.slice(11, 16);
               if (row.differenceInMinutes > 0) {
                  //timeEstimated.push(row.liveEstimateTime.slice(11, 16));
                  timeEstimated.push(<br key="br" />);
               }
            }
         }
      }

      // TODO: change these to proper stations via station data
      let departureStation = this.props.train.timeTableRows[0].stationShortCode;
      let arrivalStation = this.props.train.timeTableRows[
         this.props.train.timeTableRows.length - 1
      ].stationShortCode;

      return (
         <tr className={evenclass} key={this.props.i}>
            <td>
               {train.trainType} {train.trainNumber}
            </td>
            <td>{departureStation}</td>
            <td>{arrivalStation}</td>
            <td>
               {timeEstimated}
               {timeScheduled}
            </td>
         </tr>
      );
   }
}

export default TrainRows;
