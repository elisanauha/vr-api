import React, { Component } from "react";

class SearchField extends Component {
   render() {
      return (
         <div className="SearchField">
            <input
               //onChange={this.handleChange}
               type="text"
               name="citysearch"
               //value={this.state.citysearch}
            />
         </div>
      );
   }
}

export default SearchField;
