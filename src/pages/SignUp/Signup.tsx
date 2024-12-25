import React, { useState } from 'react';
import '../SignUp/Signup.css';

function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    email: '',
    otp: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Form submitted successfully!');
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1 className="title">Sign up</h1>
        <p className="subtitle">Sign up to enjoy the feature of HD</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="dob">Date of Birth</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>

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
          </div>

          <div className="input-group">
            <label htmlFor="otp">OTP</label>
            <input
              type="password"
              id="otp"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              placeholder="Enter OTP"
              required
            />
          </div>

          <button type="submit" className="signup-button">
            Sign up
          </button>
        </form>
        <div className='bottom-container' >
        <div className="divider">or</div>

<button className="google-button">Continue with Google</button>

<p className="signin-text">
  Already have an account? <a href="#">Sign in</a>
</p>
        </div>

        
      </div>

      <div className="image-container">
        <img src="/assets/bg-image.png" alt="Background" className='logo-img' />
      </div>

    </div>
  );
}

export default SignUp;
