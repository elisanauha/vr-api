import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import HeaderPanel from "./components/HeaderPanel";
import SearchPanel from "./components/SearchPanel";
//import Sisalto from "./components/Content";

class App extends Component {
   render() {
      return (
         <div className="App">
            <HeaderPanel />
            <SearchPanel />
         </div>
      );
   }
}

export default App;
