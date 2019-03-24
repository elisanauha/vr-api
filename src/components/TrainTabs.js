import React, { Component } from "react";
import TrainTable from "./TrainTable";

class TrainTabs extends Component {
   render() {
      // A check on which we want active
      let arrivingTabActivity = "inactive";
      let departingTabActivity = "active";
      if (this.props.arrivingTab) {
         arrivingTabActivity = "active";
         departingTabActivity = "inactive";
      }

      return (
         <div className="TrainTabs">
            <div className="tab">
               <button
                  className={arrivingTabActivity}
                  id="arriving"
                  onClick={this.props.onTabChange}
               >
                  Saapuvat
               </button>
               <button
                  className={departingTabActivity}
                  id="leaving"
                  onClick={this.props.onTabChange}
               >
                  Lähtevät
               </button>
            </div>

            <TrainTable
               trains={this.props.trains}
               station={this.props.station}
               arrivingTab={this.props.arrivingTab}
               stations={this.props.stations}
            />
         </div>
      );
   }
}

export default TrainTabs;
