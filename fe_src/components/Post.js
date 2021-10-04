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
import { Link, useHistory, useParams } from "react-router-dom";

const pageState = {
  CREATE: "CREATE",
  MODIFY: "MODIFY",
  READ: "READ",
};

function Post() {
  let { postid } = useParams();
  let history = useHistory();
  let [state, setState] = useState({
    title: "",
    videolink: "",
    korean: [""],
    english: [""],
    visible: [false],
    pageState: pageState.CREATE,
  });

  useEffect(() => {
    if (postid != undefined) {
      fetch(`/post/${postid}`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);

          let korean = data.korean.split(";");
          let english = data.english.split(";");

          setState({
            title: data.title,
            videolink: data.videolink,
            korean: korean,
            english: english,
            visible: Array.from({ length: korean.length }, () => false),
            pageState: pageState.READ,
          });
        });
    }
  }, []);

  function changeTitle(event) {
    setState({
      ...state,
      title: event.target.value,
    });
  }

  function changeVideoLink(event) {
    setState({
      ...state,
      videolink: event.target.value,
    });
  }

  function changeKorean(event, i) {
    state.korean[i] = event.target.value;
    setState({
      ...state,
    });
  }

  function changeEnglish(event, i) {
    state.english[i] = event.target.value;
    setState({
      ...state,
    });
  }

  function changeVisible(event, i) {
    state.visible[i] = state.visible[i] ? false : true;
    setState({
      ...state,
    });
  }

  function addText() {
    state.korean.push("");
    state.english.push("");
    setState({
      ...state,
    });
  }

  function removeText() {
    if (state.korean.length == 1) {
      alert("문장은 적어도 하나 존재해야 합니다.");
      return;
    }
    if (confirm("마지막 문장을 삭제하시겠습니까?")) {
      state.korean.pop();
      state.english.pop();
      setState({
        ...state,
      });
    }
  }

  function cancle() {
    setState({
      ...state,
      pageState: pageState.READ,
    });
  }

  function gotoList() {
    history.push("/");
  }

  function deletePost() {
    console.log("delete");
  }

  function createPost() {
    fetch("/post", {
      method: "post",
      body: JSON.stringify(state),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
      });
  }

  function modifyPost() {
    setState({
      ...state,
      pageState: pageState.MODIFY,
    });
  }

  function updatePost() {
    console.log("update");
  }

  if (
    state.pageState == pageState.CREATE ||
    state.pageState == pageState.MODIFY
  ) {
    return (
      <Container fluid>
        <Row>
          <Col md={{ offset: 3, span: 6 }} xs={{ offset: 2, span: 8 }}>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="제목을 입력하시오"
                value={state.title}
                onInput={changeTitle}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Link</Form.Label>
              <Form.Control
                type="text"
                placeholder="유튜브 주소를 입력하시오"
                value={state.videolink}
                onInput={changeVideoLink}
              />
              {state.videolink != "" ? (
                <div
                  className="embed-responsive embed-responsive-16by9"
                  id="videodiv"
                >
                  <iframe
                    id="videoframe"
                    className="embed-responsive-item"
                    src={state.videolink}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
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
              )}
              {state.korean.map((_, i) => {
                return (
                  <Form.Group key={i}>
                    <div>
                      {i == 0 ? <Form.Label>Text</Form.Label> : null}
                      <Form.Control
                        type="text"
                        id={`kor-${i}`}
                        placeholder="한국어를 입력하시오"
                        value={state.korean[i]}
                        onInput={(e) => changeKorean(e, i)}
                      />
                      <Form.Control
                        type="text"
                        id={`eng-${i}`}
                        placeholder="영어를 입력하시오"
                        value={state.english[i]}
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
        {state.pageState == pageState.CREATE ? (
          <Row>
            <Col md={{ offset: 3, span: 3 }} xs={{ offset: 2, span: 4 }}>
              <div className="d-grid gap-1">
                <Button variant="light" size="lg" onClick={gotoList}>
                  취소
                </Button>
              </div>
            </Col>
            <Col md={{ span: 3 }} xs={{ span: 4 }}>
              <div className="d-grid gap-1">
                <Button variant="primary" size="lg" onClick={createPost}>
                  저장
                </Button>
              </div>
            </Col>
          </Row>
        ) : (
          <Row>
            <Col md={{ offset: 3, span: 3 }} xs={{ offset: 2, span: 4 }}>
              <div className="d-grid gap-1">
                <Button variant="light" size="lg" onClick={cancle}>
                  취소
                </Button>
              </div>
            </Col>
            <Col md={{ span: 3 }} xs={{ span: 4 }}>
              <div className="d-grid gap-1">
                <Button variant="primary" size="lg" onClick={updatePost}>
                  저장
                </Button>
              </div>
            </Col>
          </Row>
        )}
      </Container>
    );
  } else if (state.pageState == pageState.READ) {
    return (
      <Container fluid>
        <Row>
          <Col md={{ offset: 3, span: 6 }} xs={{ offset: 2, span: 8 }}>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <p>{state.title}</p>
            </Form.Group>

            <Form.Group>
              <Form.Label>Link</Form.Label>
              {state.videolink != "" ? (
                <div
                  className="embed-responsive embed-responsive-16by9"
                  id="videodiv"
                >
                  <iframe
                    id="videoframe"
                    className="embed-responsive-item"
                    src={state.videolink}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
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
              )}
            </Form.Group>

            {state.korean.map((_, i) => {
              return (
                <Form.Group key={i}>
                  <div>
                    {i == 0 ? <Form.Label>Text</Form.Label> : null}
                    {state.visible[i] ? (
                      <>
                        <p id={`kor-${i}`}>
                          <span
                            className="visible"
                            onClick={(e) => changeVisible(e, i)}
                          >
                            {state.korean[i]}
                          </span>
                        </p>
                        <p id={`eng-${i}`}>{state.english[i]}</p>
                      </>
                    ) : (
                      <>
                        <p id={`kor-${i}`}>
                          <span
                            className="nonvisible"
                            onClick={(e) => changeVisible(e, i)}
                          >
                            {state.korean[i]}
                          </span>
                        </p>
                      </>
                    )}
                  </div>
                </Form.Group>
              );
            })}
          </Col>
        </Row>
        <br />
        <Row>
          <Col md={{ offset: 3, span: 3 }} xs={{ offset: 2, span: 4 }}>
            <div className="d-grid gap-1">
              <Button variant="danger" size="lg" onClick={deletePost}>
                삭제
              </Button>
            </div>
          </Col>
          <Col md={{ span: 3 }} xs={{ span: 4 }}>
            <div className="d-grid gap-1">
              <Button variant="light" size="lg" onClick={modifyPost}>
                수정
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Post;
