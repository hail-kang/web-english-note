import React, { useState } from "react";
import { BrowserRouter, Route, Switch, Link, Redirect } from "react-router-dom";

import { Container, Navbar, Nav } from "react-bootstrap";

import Login from "./Login";
import PostList from "./PostList";
import Post from "./Post";

function App() {
  const [auth, setAuth] = useState({ isLoggedIn: false, username: "" });
  return (
    <BrowserRouter>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
            EngNot
          </Navbar.Brand>
          {auth.isLoggedIn ? (
            <>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse
                id="basic-navbar-nav"
                className="justify-content-end"
              >
                <Nav className="me-auto">
                  <Nav.Link as={Link} to="/post">
                    Create
                  </Nav.Link>
                  <Nav.Link href="/signout">SignOut({auth.username})</Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </>
          ) : null}
        </Container>
      </Navbar>
      <Switch>
        <Route exact path="/">
          {auth.isLoggedIn ? <PostList /> : <Redirect to="/signin" />}
        </Route>
        <Route exact path="/post">
          <Post />
        </Route>
        <Route path="/post/:postid">
          <Post />
        </Route>
        <Route path="/signin">
          <Login setAuth={setAuth} />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
