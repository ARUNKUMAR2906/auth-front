import { useState } from "react";
import { Container, Form, Button, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/SignUp.css";
const apiUrl = import.meta.env.VITE_SIGNUP_API;

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;

    // Reset errors
    setEmailError("");
    setPasswordError("");
    setServerError("");
    setSuccessMessage("");

    // Email validation
    if (!email.includes("@")) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    }

    // Password validation
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      valid = false;
    }

    if (!valid) return;
    setIsLoading(true);
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Display backend error in the UI
        setServerError(data.error || "Failed to sign up. Please try again.");
        return;
      }

      // If signup is successful
      setSuccessMessage(data.message || "Signup successful!");
      console.log("Signup:", data.message);

      // Navigate to the login page after 2 seconds
      setTimeout(() => navigate("/Login"), 2000);
    } catch (error) {
      console.error("Error during signup:", error);
      setServerError("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <h1>Sign Up</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Your Name"
            className="form-control"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className="form-control"
          />
          {emailError && <p className="text-danger mt-1">{emailError}</p>}
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="form-control"
          />
          {passwordError && <p className="text-danger mt-1">{passwordError}</p>}
        </Form.Group>

        {serverError && <p className="text-danger mt-3">{serverError}</p>}
        {successMessage && (
          <p className="text-success mt-3">{successMessage}</p>
        )}

        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? <Spinner animation="border" size="sm" /> : "SignUp"}
        </Button>
      </Form>
      <div className="d-flex mt-4">
        <p className="me-2">Already Have an Account?</p>
        <Link to="/Login" className="link">
          Click Here
        </Link>
      </div>
    </Container>
  );
};

export default SignUp;
