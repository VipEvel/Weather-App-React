import React, { useState } from "react";
import CurrentLocation from "./components/currentLocation";
import "./App.css";

function App() {
  return (
    <div className="main-container">
      <CurrentLocation />
      <div className="footer-info">
        Follow
        <a
          target="_blank"
          className="ml-5"
          rel="noopener noreferrer"
          href="https://www.github.com/vipevel/"
        >
          VipEveL
        </a>
      </div>
    </div>
  );
}

export default App;
