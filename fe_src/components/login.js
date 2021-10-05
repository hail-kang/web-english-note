import React, { useState } from "react";
import {
  Col,
  Container,
  Row,
  Form,
  InputGroup,
  FormControl,
  Button,
} from "react-bootstrap";
import { useHistory } from "react-router";

function LoginForm({ setAuth }) {
  let history = useHistory();
  const [username, setUsername] = useState("");
  function login() {
    fetch("/login", {
      method: "post",
      body: JSON.stringify({ username }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setAuth({
          isLoggedIn: true,
          username: data.username,
        });
        history.push("/");
      });
  }
  function onUsernameInput(event) {
    setUsername(event.target.value);
  }

  return (
    <InputGroup>
      <FormControl
        type="text"
        placeholder="이름을 입력하시오"
        value={username}
        onInput={onUsernameInput}
      ></FormControl>
      <Button variant="outline-secondary" onClick={login}>
        확인
      </Button>
    </InputGroup>
  );
}

function Login({ setAuth }) {
  return (
    <Container style={{ marginTop: "200px" }}>
      <Row>
        <Col md={{ offset: 3, span: 6 }} xs={{ offset: 2, span: 8 }}>
          <Form>
            <LoginForm setAuth={setAuth} />
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
