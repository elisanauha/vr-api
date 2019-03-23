import React, { Component } from "react";

import TrainRows from "./TrainRows";

class TrainTable extends Component {
   render() {
      return (
         <div className="TrainTable">
            <table>
               <tbody>
                  <tr className="HeaderRow">
                     <th>Juna</th>
                     <th>Lähtöasema</th>
                     <th>Pääteasema</th>
                     <th>Saapuu</th>
                  </tr>
                  <TrainRows />
                  <tr className="EvenRow">
                     <td>Juna</td>
                     <td>Lähtöasema</td>
                     <td>Pääteasema</td>
                     <td>Saapuu</td>
                  </tr>
               </tbody>
            </table>
         </div>
      );
   }
}

export default TrainTable;
