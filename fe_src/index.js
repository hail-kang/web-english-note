import "./index.scss";

import React from "react";
import { render } from "react-dom";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";

import App from "./components/App";
import Login from "./components/Login";

render(
  <BrowserRouter>
    {/* <nav>
      <ul>
        <li>
          <Link to="/appv">Home</Link>
        </li>
        <li>
          <Link to="/">Login</Link>
        </li>
      </ul>
    </nav> */}
    <Switch>
      <Route path="/">
        <Login />
      </Route>
      <Route path="/appv">
        <App />
      </Route>
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
