import React, { Component } from "react";
//import "./App.css";
import TrainTable from "./TrainTable";

class TrainTabs extends Component {
   render() {
      let buttons = [];
      if (this.props.arrivingTab) {
         buttons.push(
            <div className="tab" key="arriving">
               <button
                  className="active"
                  id="arriving"
                  onClick={this.props.onTabChange}
               >
                  Saapuvat
               </button>
               <button
                  className="inactive"
                  id="leaving"
                  onClick={this.props.onTabChange}
               >
                  Lähtevät
               </button>
            </div>
         );
      } else {
         buttons.push(
            <div className="tab" key="leaving">
               <button
                  className="inactive"
                  id="arriving"
                  onClick={this.props.onTabChange}
               >
                  Saapuvat
               </button>
               <button
                  className="active"
                  id="leaving"
                  onClick={this.props.onTabChange}
               >
                  Lähtevät
               </button>
            </div>
         );
      }

      return (
         <div className="TrainTabs">
            {buttons}

            <TrainTable
               trains={this.props.trains}
               station={this.props.station}
               arrivingTab={this.props.arrivingTab}
            />
         </div>
      );
   }
}

export default TrainTabs;
