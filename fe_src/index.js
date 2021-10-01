import "./index.scss";

import React from "react";
import { render } from "react-dom";
import { Router, Route, hashHistory } from "react-router";

import App from "./components/App";
import Login from "./components/Login";

render(
  <Router>
    <Route path="/" component={App} />
  </Router>,
  document.getElementById("root")
);
