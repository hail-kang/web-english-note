import React, { useState, useEffect } from "react";
import { Col, Container, Row, ListGroup, ListGroupItem } from "react-bootstrap";
import { Link } from "react-router-dom";

function PostList() {
  const [state, setState] = useState({
    error: null,
    isLoaded: false,
    items: [],
  });

  useEffect(() => {
    fetch("/post").then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setState({
            error: null,
            isLoaded: true,
            items: data.posts,
          });
        });
      } else {
        response.json().then((data) => {
          setState({
            error: {
              status: response.status,
              message: data.message,
            },
          });
        });
      }
    });
  }, []);

  if (state.error != null) {
    return <div>{`[${state.error.status} Error] ${state.error.message}`}</div>;
  } else if (!state.isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <Container>
        <Row>
          <Col md={{ offset: 4, span: 4 }} xl={{ offset: 2, span: 8 }}>
            <ListGroup>
              {state.items.map((item) => {
                return (
                  <ListGroupItem
                    key={item.postid}
                    style={{
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                    as={Link}
                    to={`post/${item.postid}`}
                  >
                    {item.title}
                  </ListGroupItem>
                );
              })}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default PostList;
