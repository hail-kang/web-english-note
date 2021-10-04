import React, { useContext, createContext, useState } from "react";
import {
  BrowserRouter,
  Route,
  Switch,
  useHistory,
  Link,
  Redirect,
} from "react-router-dom";

import {
  Col,
  Container,
  Row,
  Form,
  InputGroup,
  FormControl,
  Button,
  Navbar,
  Nav,
} from "react-bootstrap";

import Login from "./Login";
import PostList from "./PostList";
import Post from "./Post";

function App() {
  const [auth, setAuth] = useState({ isLoggedIn: false, username: "" });
  return (
    <BrowserRouter>
      <Navbar bg="light">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
            EngNot
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav>
              {auth.isLoggedIn ? (
                <Nav.Link as={Link} to="/post">
                  Create
                </Nav.Link>
              ) : null}
              {auth.isLoggedIn ? (
                <Nav.Link href="/logout">SignOut({auth.username})</Nav.Link>
              ) : null}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Switch>
        <Route exact path="/">
          {auth.isLoggedIn ? <PostList /> : <Redirect to="/login" />}
        </Route>
        <Route path="/post">
          <Post />
        </Route>
        <Route path="/login">
          <Login setAuth={setAuth} />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
