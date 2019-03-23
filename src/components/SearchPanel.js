import React, { Component } from "react";
//import "./App.css";
import SearchField from "./SearchField";

class SearchPanel extends Component {
   render() {
      return (
         <div className="SearchPanel">
            <p>Hae aseman nimellä</p>
            <SearchField />
         </div>
      );
   }
}

export default SearchPanel;
