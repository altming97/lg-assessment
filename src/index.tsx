import React from "react";
import ReactDOM from "react-dom/client";
// Include application component.
import App from "./App";

/**
 * This file can be ignored, please work in ./components/App.jsx
 */

// Include mock API.
import "./mock";

// Include styles.
import "./styles/index.css";
import "./styles/global.scss";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <React.StrictMode>
    <App />,
  </React.StrictMode>,
);
