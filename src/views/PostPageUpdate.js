import React, { useEffect, useState } from "react";
import { Button, Container, Form, Nav, Navbar, Image,Row } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, storage } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import MapPicker from "react-google-map-picker";

const DefaultLocation = { lat: 1.366, lng: 103.83718379999999 };
const DefaultZoom = 16;

export default function PostPageUpdate() {
  const params = useParams();
  const id = params.id;
  const [fishName, setFishName] = useState("");
  const [image, setImage] = useState("");
  const [imageName, setImageName] = useState("");
  const [previewImage, setPreviewImage] = useState(
    "https://zca.sg/img/placeholder"
  );
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [fishDescription, setFishDescription] = useState("");

  const [defaultLocation, setDefaultLocation] = useState(DefaultLocation);
  const [zoom, setZoom] = useState(DefaultZoom);
  const [location, setLocation] = useState(defaultLocation);
  const [createdBy, setCreatedBy] = useState("");
  const [lastEditedBy, setLastEditedBy] = useState("");
  const [username, setUsername] = useState("");

  //react map picker
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const handleSelect = async (selectedAddress) => {};
  function handleChangeLocation(lat, lng) {
    setLocation({ lat: lat, lng: lng });
  }

  function handleChangeZoom(newZoom) {
    setZoom(newZoom);
  }

  function handleResetLocation() {
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);
      setDefaultLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });

    setZoom(DefaultZoom);
  }

  async function updatePost() {
    let imageURL = previewImage;

    if (image) {
      const deleteRef = ref(storage, `images/${imageName}`);
      await deleteObject(deleteRef);
      console.log("old image has been deleted from gcs!");
      const imageReference = ref(storage, `images/${image.name}`);
      const response = await uploadBytes(imageReference, image);
      imageURL = await getDownloadURL(response.ref);
    }

    await updateDoc(doc(db, "posts", id), {
      fishName,
      fishDescription: fishDescription,
      image: imageURL,
      lastEditedBy: username,
      fishCoordinates: location,
    });
    navigate("/");
  }
  async function getUsername() {
    const userDocument = await getDoc(doc(db, "users", user.uid));
    const userd = userDocument.data();
    setUsername(userd.userName);
  }

  async function getPost(id) {
    const postDocument = await getDoc(doc(db, "posts", id));
    const post = postDocument.data();
    setFishName(post.fishName);
    setPreviewImage(post.image);
    setImageName(post.imageName);
    setFishDescription(post.fishDescription);
    setDefaultLocation(post.fishCoordinates);
    setLocation(post.fishCoordinates);
  }

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/login");
    getUsername();
    getPost(id);
  }, [id, navigate, user, loading]);

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
            <Nav.Link href="/add">Submit a Catch</Nav.Link>
            {user && (
              <Nav.Link onClick={(e) => signOut(auth)}>Log Out</Nav.Link>
            )}
          </Nav>
        </Container>
      </Navbar>

      <header style={{ paddingLeft: 0 }}>
        <div
          className="p-5 text-center bg-image"
          style={{
            backgroundImage: "url('/catch.jpg')",
            height: "60vh",
            backgroundSize: "cover",
            backgroundPosition: "center 33%",
          }}
        >
          <div
            className="mask"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.4)", minHeight: "70%" }}
          >
            <div className="d-flex justify-content-center align-items-center h-100" style={{paddingTop:'47px'}}>
              <div className="text-white mt-5">
                <h1 className="">Update a Catch</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div>
        <Container>
          <Row>
            <div className="col-6">
              <br></br>
              <Form>
                <Form.Group className="mt-1 mb-3" controlId="fishName">
                  <Form.Label><h5>Fish Name</h5></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. Barramundi.."
                    value={fishName}
                    onChange={(text) => setFishName(text.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mt-2 mb-3" controlId="fishDescription">
                  <Form.Label><h5>Fish Description</h5></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. The barramundi, Asian sea bass, or giant sea perch, is a species of catadromous fish in the family Latidae of the order Perciformes. .."
                    value={fishDescription}
                    onChange={(text) => setFishDescription(text.target.value)}
                  />
                </Form.Group>

                <Image
                  src={previewImage}
                  style={{
                    objectFit: "cover",
                    width: "10rem",
                    height: "10rem",
                  }}
                />
                <Form.Group className="mt-2 mb-3" controlId="image">
                  <Form.Label><h5>Picture of Fish</h5></Form.Label>
                  <Form.Control
                    type="file"
                    onChangeCapture={(e) => {
                      if (e.target.files.length === 0) {
                        getPost(id);
                        setImage("");
                        return;
                      }

                      const imageFile = e.target.files[0];
                      const previewImage = URL.createObjectURL(imageFile);
                      setImage(imageFile);
                      setPreviewImage(previewImage);
                    }}
                  />
                  <Form.Text className="text-muted">
                    Make sure the url has a image type at the end: jpg, jpeg,
                    png.
                  </Form.Text>
                </Form.Group>

                <Form.Group>
                  <>
                    {/* <Form.Label>Latitude: </Form.Label>
                <input type="text" className="form-control" value={location.lat} disabled />
                <br></br>
                <Form.Label>Longitude: </Form.Label>
                <input type="text" className="form-control" value={location.lng} disabled />
                <br></br>
                <Form.Label>Zoom: </Form.Label>
                <input type="text" className="form-control" value={zoom} disabled />
                <br></br> */}
                    <button
                      className="btn btn-primary"
                      onClick={handleResetLocation}
                    >
                      Reset Location
                    </button>
                    <br></br>
                    <br></br>
                    <MapPicker
                      defaultLocation={defaultLocation}
                      zoom={zoom}
                      mapTypeId="roadmap"
                      style={{ height: "50vh", width: "100%" }}
                      onChangeLocation={handleChangeLocation}
                      onChangeZoom={handleChangeZoom}
                      apiKey="{google_maps_api_key}"
                    />
                  </>
                </Form.Group>
                <br></br>
                <Button variant="primary" onClick={(e) => updatePost()}>
                  Update
                </Button>
                <br></br>
                <br></br>
              </Form>
            </div>
          </Row>
        </Container>
        <footer style={{ backgroundColor: "#89CFF0", width: "100vw" }}>
          <div className="container-fluid">
            <div
              className="col p-3"
              style={{ textAlign: "right", fontStyle: "italic" }}
            >
              {" "}
              Copyright 2023 - WhatTheFish
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
