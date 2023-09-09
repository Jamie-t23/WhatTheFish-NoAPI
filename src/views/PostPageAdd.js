import React, { useEffect, useState } from "react";
import { Button, Container, Form, Nav, Navbar, Image, Row } from "react-bootstrap";
import { doc,getDoc,addDoc, collection } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../firebase";
import { signOut } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import MapPicker from "react-google-map-picker";
// import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import {  getLatLng,geocodeByAddress } from 'react-google-places-autocomplete';
// import LocationInputForm from './LocationInputForm';
// import MapComponent from './MapComponent';

const DefaultLocation = { lat: 1.366, lng: 103.83718379999999 };
const DefaultZoom = 16;

export default function PostPageAdd() {
  const [user, loading] = useAuthState(auth);
  const [username,setUsername] = useState('');

  const [defaultLocation, setDefaultLocation] = useState(DefaultLocation);
  const [zoom, setZoom] = useState(DefaultZoom);
  const [location, setLocation] = useState(defaultLocation);
  
  //react map picker 
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const handleSelect = async (selectedAddress) => {
    try {
      const results = await geocodeByAddress(selectedAddress);
      const latLng = await getLatLng(results[0]);
      setAddress(selectedAddress);
      console.log("latlng"+ latLng)
      setCoordinates(latLng);
    } catch (error) {
      console.error('Error fetching geolocation data:', error);
    }
  };
  function handleChangeLocation(lat, lng) {
    setLocation({ lat: lat, lng: lng });
  }

  function handleChangeZoom(newZoom) {
    setZoom(newZoom);
  }

  async function getUsername(id) {
    const userDocument = await getDoc(doc(db, "users", user.uid));
    const userd = userDocument.data();
    setUsername(userd.userName)
  }

  function handleResetLocation() {
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);
      setDefaultLocation({  lat: position.coords.latitude,
        lng: position.coords.longitude, });
    });
   
    setZoom(DefaultZoom);
  }

  //Submission Details
  const [fishName, setFishName] = useState("");
  const [image, setImage] = useState("");
  const [fishDescription, setFishDescription] = useState("");
  const [fishCoordinates, setFishCoordinates] = useState("");
  const [placesResult, setPlacesResult] = useState("");
  //Submission metadata
  const [publishedDate, setPublishedDate] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [lastEditedBy, setLastEditedBy] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const [previewImage, setPreviewImage] = useState("/placeholder.png");
  const navigate = useNavigate();


  async function addPost() {
    var validateFlag = true;
    if(!fishName){
      alert('Please fill in the Fish Name')
      validateFlag = false
    }

    if(!fishDescription){
      alert('Please fill in the Fish Description')
      validateFlag = false
    }

   
    if(validateFlag){
      const imageReference = ref(storage, `images/${image.name}`);
    const response = await uploadBytes(imageReference, image);
    const imageUrl = await getDownloadURL(response.ref);
    if(!imageUrl){
      alert('Please add a picture')
      validateFlag = false
    }
    setCurrentDateTime(new Date());

    await addDoc(collection(db, "posts"), {
      fishName,
      fishDescription: fishDescription,
      fishCoordinates: location,
      image: imageUrl,
      imageName: image.name,
      createdBy: username,
      lastEditedBy: username,
      publishedDate: currentDateTime
     
      
    });
    navigate("/");
    }
  }

  //We want to make sure only logged in users can add a post.
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
    getUsername();
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);
      setDefaultLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }, [loading, user, navigate]);

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
                <h1 className="">Submit a Catch</h1>
              </div>
            </div>
          </div>
        </div>
      </header>
      <Container style={{ textAlign: "left" }}>
          <Row>
          <div className='col-8'>
          <Form className="mt-5">
            <Form.Group className="mt-1 mb-3" controlId="fishName">
              <Form.Label><h5>Fish Name</h5></Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Barramundi.."
                required="true"
                alt
                value={fishName}
                onChange={(text) => setFishName(text.target.value)}
              />
            </Form.Group>

            <Form.Group className="mt-3 mb-3" controlId="fishDescription">
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
            <br></br>
              <Form.Label><h5>Picture of Fish</h5></Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => {
                  if (e.target.files.length === 0) return;
                  const imageFile = e.target.files[0];
                  const previewImage = URL.createObjectURL(imageFile);
                  setImage(imageFile);
                  setPreviewImage(previewImage);
                }}
              />
            </Form.Group>
                <Form.Group>
                  <>
                  
                  {/* <div>
    <GooglePlacesAutocomplete
      apiKey="AIzaSyBg1VzjCNi4DEkH9t0aKkrDVUYmU5lNSgY"
      value={address}
        onChange={setAddress}
        onSelect={handleSelect}
    />
  </div> */}
                  </>
                </Form.Group>
            <Form.Group>
              <>
{/*           
                <Form.Label>Latitude: </Form.Label>
                <input type="text" className="form-control" value={location.lat} disabled />
                <br></br>
                <Form.Label>Longitude: </Form.Label>
                <input type="text" className="form-control" value={location.lng} disabled />
                <br></br> */}
                {/* <Form.Label>Zoom: </Form.Label>
                <input type="text" className="form-control" value={zoom} disabled /> */}
                {/* <br></br> */}
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
                  style={{ height: "50vh" ,width:"100%"}}
                  onChangeLocation={handleChangeLocation}
                  onChangeZoom={handleChangeZoom}
                  apiKey="{google_maps_api_key}"
                />
              </>
              
            </Form.Group>
         
            <br></br>
            <Button
              className="mb-5 btn btn-primary"
              variant="primary"
              onClick={async (e) => addPost()}
            >
              Submit
            </Button>
          </Form>
        </div>
          </Row>
      </Container>

      <footer style={{backgroundColor:'#89CFF0',width:'100vw'}}>
        <div className="container-fluid">
          <div className="col p-3" style={{textAlign:'right',fontStyle:'italic'}}> Copyright 2023 - WhatTheFish</div>
        </div>
      </footer>
    </>
  );
}
