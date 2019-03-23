import React, { Component } from "react";
//import "./App.css";
import TrainTable from "./TrainTable";

class TrainTabs extends Component {
   render() {
      return (
         <div className="TrainTabs">
            <div className="tab">
               <button className="tablinks">Saapuvat</button>
               <button className="tablinks">Lähtevät</button>
            </div>

            <TrainTable />
         </div>
      );
   }
}

export default TrainTabs;
