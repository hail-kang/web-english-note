import React, { useState, useEffect } from "react";
import {
  Col,
  Container,
  Row,
  Form,
  InputGroup,
  FormControl,
  Button,
  ListGroup,
  ListGroupItem,
  FormGroup,
} from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";

function Post() {
  const [title, setTitle] = useState("");
  const [videolink, setVideolink] = useState("");
  const [korean, setKorean] = useState([""]);
  const [english, setEnglish] = useState([""]);

  function changeTitle(event) {
    setTitle(event.target.value);
  }

  function changeVideoLink(event) {
    setVideolink(event.target.value);
  }

  function changeKorean(event, i) {
    korean[i] = event.target.value;
    console.log(korean);
    setKorean([...korean]);
  }

  function changeEnglish(event, i) {
    english[i] = event.target.value;
    console.log(english);
    setEnglish([...english]);
  }

  function addText() {
    korean.push("");
    english.push("");
    setKorean([...korean]);
    setEnglish([...english]);
  }

  function removeText() {
    korean.pop();
    english.pop();
    setKorean([...korean]);
    setEnglish([...english]);
  }

  return (
    <Container fluid>
      <Row>
        <Col md={{ offset: 3, span: 6 }} xs={{ offset: 2, span: 8 }}>
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="제목을 입력하시오"
              value={title}
              onInput={changeTitle}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Link</Form.Label>
            <Form.Control
              type="text"
              placeholder="유튜브 주소를 입력하시오"
              value={videolink}
              onInput={changeVideoLink}
            />
            <Form.Control type="hidden" id="videoembed" />
            <div
              className="embed-responsive embed-responsive-16by9"
              style={{ display: "none" }}
              id="videodiv"
            >
              <iframe
                id="videoframe"
                className="embed-responsive-item"
                src=""
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            {korean.map((_, i) => {
              return (
                <Form.Group key={i}>
                  <div>
                    {i == 0 ? <Form.Label>Text</Form.Label> : null}
                    <Form.Control
                      type="text"
                      id={`kor-${i}`}
                      placeholder="한국어를 입력하시오"
                      value={korean[i]}
                      onInput={(e) => changeKorean(e, i)}
                    />
                    <Form.Control
                      type="text"
                      id={`eng-${i}`}
                      placeholder="영어를 입력하시오"
                      value={english[i]}
                      onInput={(e) => changeEnglish(e, i)}
                    />
                  </div>
                  <br />
                </Form.Group>
              );
            })}
            <Button variant="light" onClick={addText}>
              <span className="fi-plus"></span>
            </Button>{" "}
            <Button variant="danger" onClick={removeText}>
              <span className="fi-minus"></span>
            </Button>
          </Form.Group>
        </Col>
      </Row>
      <br />
      <Row>
        <Col md={{ offset: 3, span: 3 }} xs={{ offset: 2, span: 4 }}>
          <div className="d-grid gap-1">
            <Button variant="danger" size="lg">
              취소
            </Button>
          </div>
        </Col>
        <Col md={{ span: 3 }} xs={{ span: 4 }}>
          <div className="d-grid gap-1">
            <Button variant="light" size="lg">
              저장
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Post;
