import React, { useState } from "react";
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
} from "react-bootstrap";
import { useHistory } from "react-router";

async function PostList() {
  let posts = await fetch("/posts").then((response) => {
    return response.json();
  });
  return (
    <Container fluid>
      <Row>
        <ListGroup>
          {posts.map((post) => {
            return (
              <ListGroupItem
                style={{ "text-overflow": "ellipsis", overflow: "hidden" }}
              >
                <Link to="/post/:postid" style={{ "white-space": "nowrap" }}>
                  {post.title}
                </Link>
              </ListGroupItem>
            );
          })}
        </ListGroup>
      </Row>
    </Container>
  );
}

export default PostList;
