import React, { Component } from "react";

import SearchField from "./SearchField";

class SearchPanel extends Component {
   render() {
      return (
         <div className="SearchPanel">
            <p>Hae aseman nimellä</p>
            <SearchField
               onSearchChange={this.props.onSearchChange}
               searchTerm={this.props.searchTerm}
            />
            <p>{this.props.stationFull}</p>
         </div>
      );
   }
}

export default SearchPanel;
