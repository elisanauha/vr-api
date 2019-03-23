import React, { Component } from "react";

import "./App.css";
import HeaderPanel from "./components/HeaderPanel";
import SearchPanel from "./components/SearchPanel";
import TrainTabs from "./components/TrainTabs";

class App extends Component {
   render() {
      return (
         <div className="App">
            <HeaderPanel />
            <SearchPanel />
            <TrainTabs />
         </div>
      );
   }
}

export default App;
