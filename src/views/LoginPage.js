import React, { useState } from "react";
import { Button, Container, Form, Nav, Navbar } from "react-bootstrap";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, storage } from "../firebase";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

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
            <Nav.Link href="/signup">Sign Up</Nav.Link>
            {user && (
              <Nav.Link onClick={(e) => signOut(auth)}>Log Out</Nav.Link>
            )}
          </Nav>
        </Container>
      </Navbar>
      <Container >
        <h1 className="my-3">Login to your account</h1>
        <Form>
        <p style={{color:'red',fontStyle:"italic"}}>{error}</p>
        
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
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
            <br></br>
            <a href="/signup">Sign up for an account</a>
          </Form.Group>
          <Button
            variant="primary"
            onClick={async (e) => {
              setError("");
              const canLogin = username && password;
              // if password and username fields are filled, canLogin will be true
              if (canLogin) {
                try {
                  // Try running some code
                  await signInWithEmailAndPassword(auth, username, password);
                  navigate("/");
                } catch (error) {
                  // Something went wrong! Now i'll handle it properly here
                  setError(error.message);
                }
              }
            }}
          >
            Login
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
