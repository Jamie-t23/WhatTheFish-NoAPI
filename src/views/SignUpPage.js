import React, { useState } from "react";
import { Button, Container, Form, Nav, Navbar } from "react-bootstrap";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { doc, setDoc, collection } from "firebase/firestore";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState("");

  return (
    <>
      <Navbar variant="light" bg="light">
        <Container>
          <Navbar.Brand
            href="/"
            style={{ fontFamily: "Quick Kiss Personal Use" }}
          >
            {" "}
            <img src="/logo.png" width="30" height="30" alt="logo" />{" "}
            WhatTheFish!
          </Navbar.Brand>
          <Nav>
            <Nav.Link href="/login">Login</Nav.Link>
            {user && (
              <Nav.Link onClick={(e) => signOut(auth)}>Log Out</Nav.Link>
            )}
          </Nav>
        </Container>
      </Navbar>
      <Container>
        <h1 className="my-3">Sign up for an account</h1>
        <Form>
        <p style={{color:'red',fontStyle:"italic"}}>{error}</p> 
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="username"
              placeholder="Create a Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Form.Text className="text-muted">
              Your username will be displayed when making posts.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <a href="/login">Have an existing account? Login here.</a>
          </Form.Group>
          <Button
            variant="primary"
            onClick={async (e) => {
              setError("");
              const canSignUp = email && password && username;
              if (canSignUp) {
                try {
                  localStorage.setItem("username", username);
                  await createUserWithEmailAndPassword(auth, email, password);
                 
                  //wait for create of user, insert user.id and username into users table
                  navigate("/");
                
                } catch (error) {
                  setError(error.message);
                }
              }
            }}
          >
            Sign Up
          </Button>
        </Form>

        </Container>
      <footer style={{backgroundColor:'#89CFF0',bottom:0,position:"absolute",width:'100vw'}}>
        <div className="container-fluid ">
          <div className="col p-3" style={{textAlign:'right',fontStyle:'italic'}}> Copyright 2023 - WhatTheFish</div>
        </div>
      </footer>
    </>
 
  );
}
