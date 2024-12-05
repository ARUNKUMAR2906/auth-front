import { Container, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
const apiUrl = import.meta.env.VITE_HOME_API;

const Home = () => {
  const [res, setRes] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      const token = JSON.parse(localStorage.getItem("token"));
      if (token) {
        try {
          const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error(
              `Error: ${response.status} - ${response.statusText}`
            );
          }

          const data = await response.json();
          setRes(data);
          console.log("User Data:", data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } else {
        console.error("No token found in localStorage.");
      }
    };

    fetchData(); // Call the async function
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <Container>
      <h1>{res.name}</h1>
      <h1>Welcome to Our Website</h1>
      <Button
        className="btn"
        variant="primary"
        type="button"
        onClick={() => {
          const token = localStorage.getItem("token");
          if (token) {
            console.log("Token found:", token);
          } else {
            console.error("No token found in localStorage.");
          }
        }}
      >
        Get Started
      </Button>
    </Container>
  );
};

export default Home;
