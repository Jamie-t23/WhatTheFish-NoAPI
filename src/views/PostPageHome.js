import { useEffect, useState } from "react";
import { Container, Image, Nav, Navbar, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

export default function PostPageHome() {
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState([]);

  async function getAllPosts() {
    const query = await getDocs(collection(db, "posts"));
    const posts = query.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    setPosts(posts);
  }

  async function loadUsername(){
    if (localStorage.getItem("username")) {
      setDoc(doc(db, "users", user.uid), {
        userName: localStorage.getItem("username"),
      });
      localStorage.removeItem("username");
    }
  }

  useEffect(() => {
    getAllPosts();
    loadUsername();
  }, []);

  const ImagesRow = () => {
    if (posts.length > 0) {
      return posts.map((post, index) => (
        <ImageSquare key={index} post={post} />
      ));
    } else {
      return (
        <h2 className="mt-5 mb-5" style={{ fontStyle: "italic" }}>
          There are no posts! check again later
        </h2>
      );
    }
  };

  return (
    <>
      <Navbar variant="light" bg="light" >
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
            backgroundImage: "url('/hero.jpg')",
            height: "70vh",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        >
          <div
            className="mask"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.4)", minHeight: "80%" }}
          >
            <div className="d-flex justify-content-center align-items-center h-100" style={{paddingTop:'47px'}} >
              <div className="text-white mt-5">
                <h1 className="mb-3">Hook, Line and Sinker</h1>
                <h4 className="mb-3">
                  Cast Your Stories: Where Every Catch Tells a Tale!
                </h4>
                <a
                  className="btn btn-outline-light btn-lg"
                  href="/add"
                  role="button"
                >
                  Submit a Catch!
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* body */}
      <Container>
        <Row>
          <h1 style={{ marginTop: "30px" }}>Fresh out of the water</h1>
        </Row>

        <Row>
          <ImagesRow />
        </Row>
      </Container>
      <footer style={{backgroundColor:'#89CFF0'}}>
        <div className="container-fluid ">
          <div className="col p-3" style={{textAlign:'right',fontStyle:'italic'}}> Copyright 2023 - WhatTheFish</div>
        </div>
      </footer>
    </>
  );
}

function ImageSquare({ post }) {
  const { image, id } = post;
  return (
    <Link
      to={`post/${id}`}
      style={{
        width: "18rem",
        marginLeft: "1rem",
        marginTop: "2rem",
        marginBottom: "3rem",
      }}
    >
      <Image
        src={image}
        style={{
          objectFit: "cover",
          width: "18rem",
          height: "18rem",
        }}
      />
    </Link>
  );
}


