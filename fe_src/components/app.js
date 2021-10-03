import React, { useContext, createContext } from "react";
import {
  BrowserRouter,
  Route,
  Switch,
  useHistory,
  Link,
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

class App extends React.Component {
  render() {
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
                <Nav.Link as={Link} to="/post">
                  Create
                </Nav.Link>
                <Nav.Link href="/logout">Sign out()</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Switch>
          <Route exact path="/post">
            <PostList />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route exact path="/">
            <div>main</div>
          </Route>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
