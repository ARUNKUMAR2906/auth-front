import { Container, Form, Button, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../Styles/Login.css";

const apiUrl = import.meta.env.VITE_LOGIN_API;

const Login = () => {
  const navigate = useNavigate();

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

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    }

    // Password validation
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      valid = false;
    }

    if (!valid) return;

    setIsLoading(true); // Start loading

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setServerError(data.error || "Failed to login. Please try again.");
        return;
      }
      localStorage.setItem("token", JSON.stringify(data.token));
      setSuccessMessage(data.message || "Login successful!");
      setTimeout(() => navigate("/"), 1500); // Redirect after 1.5 seconds
    } catch (error) {
      console.error("Error during login:", error);
      setServerError("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <Container>
      <h1>Login</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
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
          />
          {passwordError && <p className="text-danger mt-1">{passwordError}</p>}
        </Form.Group>

        {serverError && (
          <p className="text-danger mt-3" aria-live="assertive">
            {serverError}
          </p>
        )}
        {successMessage && (
          <p className="text-success mt-3" aria-live="polite">
            {successMessage}
          </p>
        )}

        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? <Spinner animation="border" size="sm" /> : "Login"}
        </Button>
      </Form>

      <div className="d-flex mt-4">
        <p className="me-2">Don’t have an account?</p>
        <Link to="/SignUp" className="link">
          Click Here
        </Link>
      </div>
    </Container>
  );
};

export default Login;
