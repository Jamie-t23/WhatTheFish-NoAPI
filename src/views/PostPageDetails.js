import React, { useEffect, useState } from "react";
import { Card, Col, Container, Image, Nav, Navbar, Row } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, storage } from "../firebase";
import { signOut } from "firebase/auth";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import MapPicker from "react-google-map-picker";

const DefaultLocation = { lat: 1.366, lng: 103.83718379999999 };
const DefaultZoom = 16;

export default function PostPageDetails() {
  const [fishName, setFishName] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [lastEditedBy, setLastEditedBy] = useState("");

  const [defaultLocation, setDefaultLocation] = useState(DefaultLocation);
  const [zoom, setZoom] = useState(DefaultZoom);

  const [image, setImage] = useState("");
  const [imageName, setImageName] = useState("");
  const params = useParams();
  const id = params.id;
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [fishDescription, setFishDescription] = useState("");
  const [location, setLocation] = useState(defaultLocation);

  async function deletePost(id) {
    const deleteRef = ref(storage, `images/${imageName}`);
    deleteObject(deleteRef)
      .then(() => {
        console.log("image has been deleted from firebase storage");
      })
      .catch((error) => {
        console.error(error.message);
      });
    await deleteDoc(doc(db, "posts", id));
    navigate("/");
  }

  function handleChangeLocation(lat, lng) {
    setLocation({ lat: lat, lng: lng });
  }

  function handleChangeZoom(newZoom) {
    setZoom(newZoom);
  }

  async function getPost(id) {
    const postDocument = await getDoc(doc(db, "posts", id));
    const post = postDocument.data();

    setCreatedBy(post.createdBy);
    setLastEditedBy(post.lastEditedBy);
    setFishName(post.fishName);
    setImage(post.image);
    setImageName(post.imageName);
    setFishDescription(post.fishDescription);
    setDefaultLocation(post.fishCoordinates);
  }

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/login");
    getPost(id);
  }, [id, navigate, user, loading]);

  return (
    <>
      <Navbar variant="light" bg="light">
        <Container >
          <Navbar.Brand
            href="/"
            style={{ fontFamily: "Quick Kiss Personal Use" }}
          >
            {" "}
            <img src="/logo.png" width="30" height="30" alt="logo" />{" "}
            WhatTheFish!
          </Navbar.Brand>
          <Nav>
            <Nav.Link href="/add">Submit a Catch</Nav.Link>
            {user && <Nav.Link onClick={(e) => signOut(auth)}>Log Out</Nav.Link>}
          </Nav>
        </Container>
      </Navbar>{" "}
      <div className="container-fluid" style={{minHeight:'100vh',paddingBottom:'30px'}}>
        <Row style={{ marginTop: "2rem" }}>
          <Col md="6">
            <Image src={image} style={{ width: "100%" }} />
          </Col>
          <Col>
            <Card>
              <Card.Body>
              <h5>Fish Name:</h5>
                <Card.Text>{fishName} </Card.Text>
                <h5>Fish Description:</h5>
                <Card.Text>{fishDescription} </Card.Text>
                <h5>Fish Location:</h5>
                <MapPicker
                  defaultLocation={defaultLocation}
                  zoom={zoom}
                  mapTypeId="roadmap"
                  style={{ height: "400px", width: "100%" }}
                  onChangeLocation={handleChangeLocation}
                  onChangeZoom={handleChangeZoom}
                  apiKey="{google_maps_api_key}"
                  gestureHandling="none"
                  disabled="true"
                  draggable={false}
                />
                <p>Refresh page to see location.</p>
                <hr></hr>

                <Card.Text>
                  Created By: {createdBy} <br></br>Last Edited By:{" "}
                  {lastEditedBy}
                </Card.Text>

                {/* <Card.Text>Latitude By: {location.lat} </Card.Text>
                <Card.Text>Longitude: {location.lng} </Card.Text> */}

                <Card.Link href={`/update/${id}`}>Edit</Card.Link>
                <Card.Link
                  onClick={() => deletePost(id)}
                  style={{ cursor: "pointer" }}
                >
                  Delete
                </Card.Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      <footer style={{backgroundColor:'#89CFF0',width:'100vw'}}>
        <div className="container-fluid">
          <div className="col p-3" style={{textAlign:'right',fontStyle:'italic'}}> Copyright 2023 - WhatTheFish</div>
        </div>
      </footer>
    </>
  );
}
