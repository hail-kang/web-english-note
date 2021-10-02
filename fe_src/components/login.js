import React from "react";
import {
  Col,
  Container,
  Row,
  Form,
  InputGroup,
  FormControl,
  Button,
} from "react-bootstrap";

class Login extends React.Component {
  render() {
    return (
      <Container style={{ marginTop: "200px" }}>
        <Row>
          <Col md={{ offset: 4, span: 4 }} xs={{ offset: 2, span: 8 }}>
            <Form>
              <InputGroup>
                <FormControl
                  type="text"
                  placeholder="이름을 입력하시오"
                ></FormControl>
                <Button variant="outline-secondary">확인</Button>
              </InputGroup>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Login;
