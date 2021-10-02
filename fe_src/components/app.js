import React from "react";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";

import Login from "./Login";

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/">
            <Login />
          </Route>
          <Route path="/appv">
            <App />
          </Route>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
