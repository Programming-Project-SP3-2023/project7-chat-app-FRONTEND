import React from "react";
import ReactDOM from "react-dom/client";
import "./static/style.css";
import App from "./components/App";
//React Router for client-side routing
import { BrowserRouter } from "react-router-dom";
import { SocketProvider } from "../src/services/SocketContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <SocketProvider>
        <App />
      </SocketProvider>
    </BrowserRouter>
  </React.StrictMode>
);
