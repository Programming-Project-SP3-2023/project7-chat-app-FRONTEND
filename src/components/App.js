/**
 * React main component module
 */

// Dependencies
import { Routes, Route } from "react-router-dom";

// Components
import Home from "./base/Home";
import Header from "./base/Header";

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
