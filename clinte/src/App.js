import React from "react";
import HostScreen from "./components/HostScreen";
import PlayerScreen from "./components/PlayerScreen";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HostScreen />} />
        <Route path="/player" element={<PlayerScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
