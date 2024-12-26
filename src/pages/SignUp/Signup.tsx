import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import * as Constants from "../../constants/constants.tsx";

function SignUp() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState<boolean>(false); // To track if OTP is sent
  const [otpDisabled, setOtpDisabled] = useState<boolean>(false); // Disable button state
  const [timer, setTimer] = useState<number>(60); // Countdown timer
  const navigate = useNavigate(); // For navigation

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    email: "",
    otp: "",
  });
  const [isLoginForm, setIsLoginForm] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setOtpDisabled(false);
      setTimer(60);
    }
    return () => clearInterval(interval);
  }, [otpDisabled, timer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const postSignUpData = async (url: string, body: Record<string, any>): Promise<any> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      setError((err as Error).message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const sendSignUpOtp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.dob || !formData.email) {
      alert("Please fill all required fields for OTP.");
      return;
    }

    const payload = {
      username: formData.name,
      dateOfBirth: formData.dob,
      email: formData.email,
    };

    const result = await postSignUpData(`${Constants.baseUrl}users/signup/otp`, payload);
    if (result && result.code === "200") {
      setOtpSent(true);
      setOtpDisabled(true); // Disable OTP button
    }
  };

  const userLoginOtp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!formData.email) {
      alert("Please enter email");
      return;
    }
    const payloadloginOTP = {
      email: formData.email,
    };

    const result = await postSignUpData(`${Constants.baseUrl}users/login/otp`, payloadloginOTP);
    if (result && result.code === "200") {
      setOtpSent(true);
      setOtpDisabled(true); // Disable OTP button
    }
  };

  const userlogin = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!formData.email) {
      alert("Please enter email");
      return;
    }
    const payloadlogin = {
      email: formData.email,
      otp: formData.otp,
    };
    const result = await postSignUpData(`${Constants.baseUrl}users/login/verify-otp`, payloadlogin);

    if (result && result.code === "200") {
      localStorage.setItem("authToken", result.token);
      alert(result.message);
      navigate("/home");
    } else {
      alert("Login failed. Please try again.");
    }
  };

  const handleUserSignup = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.dob || !formData.email || !formData.otp) {
      alert("Please fill all required fields.");
      return;
    }

    const payloadSignup = {
      username: formData.name,
      dateOfBirth: formData.dob,
      email: formData.email,
      otp: formData.otp,
    };

    const result = await postSignUpData(`${Constants.baseUrl}users/signup/verify-otp`, payloadSignup);

    if (result && result.code === "201") {
      setIsLoginForm(true);
      alert("Signup successful!");
    }
  };

  const toggleForm = () => {
    setIsLoginForm(!isLoginForm);
    setFormData({
      name: "",
      dob: "",
      email: "",
      otp: "",
    });
    setOtpSent(false);
    setOtpDisabled(false);
    setTimer(60);
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1 className="title">{isLoginForm ? "Login" : "Sign up"}</h1>
        <p className="subtitle">
          {isLoginForm
            ? "Login to access your account"
            : "Sign up to enjoy the feature of HD"}
        </p>
        <form>
          {!isLoginForm && (
            <div className="input-group">
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required={!isLoginForm}
              />
            </div>
          )}

          {!isLoginForm && (
            <div className="input-group">
              <label htmlFor="dob">Date of Birth</label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required={!isLoginForm}
              />
            </div>
          )}

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <button
              className="otp-button"
              onClick={isLoginForm ? userLoginOtp : sendSignUpOtp}
              disabled={otpDisabled}
            >
              {otpDisabled ? `Regenerate OTP in ${timer}s` : "Send OTP"}
            </button>
          </div>

          <div className="input-group">
            <label htmlFor="otp">OTP</label>
            <input
              type="number"
              id="otp"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              placeholder="Enter OTP"
              required
            />
          </div>

          <button
            type="submit"
            className="signup-button"
            onClick={isLoginForm ? userlogin : handleUserSignup}
          >
            {isLoginForm ? "Login" : "Sign up"}
          </button>
        </form>

        <div className="bottom-container">
          <div className="divider">or</div>
          <button className="google-button">Continue with Google</button>

          <p className="signin-text">
            {isLoginForm ? (
              <>
                Don’t have an account?{" "}
                <a href="#" onClick={toggleForm}>
                  Sign up
                </a>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <a href="#" onClick={toggleForm}>
                  Sign in
                </a>
              </>
            )}
          </p>
        </div>
      </div>

      <div className="image-container">
        <img src="/assets/bg-image.png" alt="logo-Image" className="logo-img" />
      </div>
    </div>
  );
}

export default SignUp;
