// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Force dark theme for the app by default
document.documentElement.setAttribute("data-theme", "dark");

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
