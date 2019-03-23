import React, { Component } from "react";

class TrainTable extends Component {
   render() {
      // Checking if departure or arrival column is wanted
      let timeColumn = "Lähtee";
      if (this.props.arrivingTab) {
         timeColumn = "Saapuu";
      }

      // if type is
      // type: "ARRIVAL" or type: "DEPARTURE"
      // liveEstimateTime: "2019-03-23T18:50:00.000Z"
      // scheduledTime: "2019-03-23T18:50:00.000Z"
      let trainrows = [];
      let i = 1;
      for (let train of this.props.trains) {
         let evenclass = "OddRow";
         if (i % 2 === 0) {
            evenclass = "EvenRow";
         }

         // Checking if departure or arrival times are wanted
         let timeScheduled = "";
         let timeEstimated = [];
         if (this.props.arrivingTab) {
            for (let row of train.timeTableRows) {
               if (
                  row.type === "ARRIVAL" &&
                  row.stationShortCode === this.props.station
               ) {
                  timeScheduled = row.scheduledTime.slice(11, 16);
                  if (row.differenceInMinutes > 0) {
                     timeEstimated.push(row.liveEstimateTime.slice(11, 16));
                     timeEstimated.push(<br key="br" />);
                  }
               }
            }
         } else {
            for (let row of train.timeTableRows) {
               if (
                  row.type === "DEPARTURE" &&
                  row.stationShortCode === this.props.station
               ) {
                  timeScheduled = row.scheduledTime.slice(11, 16);
                  if (row.differenceInMinutes > 0) {
                     timeEstimated.push(row.liveEstimateTime.slice(11, 16));
                     timeEstimated.push(<br key="br" />);
                  }
               }
            }
         }

         let departureStation = train.timeTableRows[0].stationShortCode;
         let arrivalStation =
            train.timeTableRows[train.timeTableRows.length - 1]
               .stationShortCode;

         trainrows.push(
            <tr className={evenclass} key={i}>
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
         i++;
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
