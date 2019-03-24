import React, { Component } from "react";

class TrainRows extends Component {
   render() {
      // set the class fort he rows so every other is in grey
      let evenclass = "OddRow";
      if (this.props.i % 2 === 0) {
         evenclass = "EvenRow";
      }

      let train = this.props.train; // less writing

      // Checking if departure or arrival times are wanted ie. "ARRIVAL" or "DEPARTURE"
      let stopType = "";
      if (this.props.arrivingTab) stopType = "ARRIVAL";
      else stopType = "DEPARTURE";

      // if it is a commuter train (trainCategory: "Commuter") then we want "Commuter train" and the line commuterLineID: "A"
      // else for long distance trains the train type and number
      let trainInfo = "";
      if (train.trainCategory === "Commuter") {
         trainInfo = "Commuter train " + train.commuterLineID;
      } else {
         trainInfo = train.trainType + " " + train.trainNumber;
      }

      // times first wants the expected time if train is late (in red),
      // then the scheduled time (smaller and in parenthesis if late),
      // and possibly "Cancelled" (in red). And if cancelled the whole row should be with grey text
      // Times in data as "2019-03-23T18:50:00.000Z"
      let times = [];
      for (let row of train.timeTableRows) {
         if (
            row.type === stopType &&
            row.stationShortCode === this.props.station
         ) {
            if (row.differenceInMinutes > 0 && row.liveEstimateTime) {
               // instead of liveEstimateTime it might also be actualTime after train has left
               times.push(
                  <p className="lateOrCancelled" key="estimate">
                     {row.liveEstimateTime.slice(11, 16)}
                  </p>
               );
               times.push(
                  <span className="late" key="scheduledlate">
                     ({row.scheduledTime.slice(11, 16)})
                  </span>
               );
            } else {
               times.push(
                  <span key="scheduled">{row.scheduledTime.slice(11, 16)}</span>
               );
            }
         }
      }
      if (train.cancelled) {
         times.push(
            <p className="lateOrCancelled" key="cancelled">
               Cancelled
            </p>
         );
         evenclass = evenclass + "C";
      }

      // Get the station codes for the departure and arrival stations and then
      // find the names of the stations in the stations data for the table
      let departureStationCode = train.timeTableRows[0].stationShortCode;
      let arrivalStationCode =
         train.timeTableRows[train.timeTableRows.length - 1].stationShortCode;
      let departureStation = "";
      let arrivalStation = "";
      for (let station of this.props.stations) {
         if (station.stationShortCode === departureStationCode)
            departureStation = station.stationName;
         if (station.stationShortCode === arrivalStationCode)
            arrivalStation = station.stationName;
      }
      // getting rid of the "asema" in some station names
      if (departureStation.endsWith("asema"))
         departureStation = departureStation.substr(
            0,
            departureStation.length - 5
         );
      if (arrivalStation.endsWith("asema"))
         arrivalStation = arrivalStation.substr(0, arrivalStation.length - 5);

      return (
         <tr className={evenclass} key={this.props.i}>
            <td>{trainInfo}</td>
            <td>{departureStation}</td>
            <td>{arrivalStation}</td>
            <td>{times}</td>
         </tr>
      );
   }
}

export default TrainRows;
