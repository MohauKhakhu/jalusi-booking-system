import React, { useState } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./styles/Signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [authing, setAuthing] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthing(true);
    setError("");

    try {
      // Create user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Update display name
      await updateProfile(userCredential.user, {
        displayName: formData.name,
      });

      console.log("User created:", userCredential.user.uid);

      // Redirect to home page
      navigate("/components/Home");
    } catch (err) {
      console.error("Sign-Up Error:", err);
      setError(err.message);
      setAuthing(false);
    }
  };

  return (
    <div className="signupWrapper">
      <div className="signupCard">
        <h2 className="signupTitle">Create Account</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <form className="signupForm" onSubmit={handleSubmit}>
          <div className="inputGroup">
            <FaUser className="inputIcon" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="inputGroup">
            <FaEnvelope className="inputIcon" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="inputGroup">
            <FaLock className="inputIcon" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btnSignup" disabled={authing}>
            {authing ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
