import React, { Component } from "react";

class SearchField extends Component {
   constructor(props) {
      super(props);
   }

   render() {
      return (
         <div className="SearchField">
            <input
               onChange={this.props.onSearchChange}
               type="text"
               name="citysearch"
               value={this.props.searchTerm}
            />
         </div>
      );
   }
}

export default SearchField;
