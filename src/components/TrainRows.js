import React, { Component } from "react";

//import TrainTable from "./TrainTable";

class TrainRows extends Component {
   render() {
      return (
         <tr className="OddRow">
            <td>Juna</td>
            <td>Lähtöasema</td>
            <td>Pääteasema</td>
            <td>Saapuu</td>
         </tr>
      );
   }
}

export default TrainRows;
