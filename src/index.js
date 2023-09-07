import React from "react";
import ReactDOM from "react-dom/client";
import "./static/style.css";
import App from "./components/App";
//React Router for client-side routing
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
