import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({ fullname: '', email: '', password: '' });
  const [errors, setErrors] = useState({ fullname: '', email: '', password: '', general: '' });
  const navigate = useNavigate();

  const regexValidations = {
    fullname: /^[A-Za-z]+(\s[A-Za-z]+)*$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let errorMessage = '';
    if (value === '') {
      errorMessage = 'This field is required.';
    } else if (!regexValidations[name].test(value)) {
      switch (name) {
        case 'fullname':
          errorMessage = 'Full name must only contain English alphabets.';
          break;
        case 'email':
          errorMessage = 'Invalid email format.';
          break;
        case 'password':
          errorMessage = 'Password must have at least one lower and one upper case letter, one special character, and one number.';
          break;
        default:
          break;
      }
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));

    setErrors((prevState) => ({
      ...prevState,
      [name]: errorMessage,
      general: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasErrors = false;
    const newErrors = { ...errors };

    // Check for empty fields
    Object.keys(formData).forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required.';
        hasErrors = true;
      } else if (errors[field]) {
        hasErrors = true;
      }
    });

    setErrors(newErrors);

    if (hasErrors) {
      setErrors((prevState) => ({
        ...prevState,
        general: 'Please enter your details correctly.'
      }));
      return;
    }

    try {
      const response = await axios.post('https://statuscode-image.onrender.com/register', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        console.log('Success:', response.data);
        navigate('/userlogin');
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="register-container">
      <div className="form-container">
        <h2>User Register</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="fullname">Full Name</label>
          <input
            type="text"
            name="fullname"
            id="fullname"
            placeholder="Enter Your Full Name"
            value={formData.fullname}
            onChange={handleChange}
            required
          />
          {errors.fullname && <p className="error-message">{errors.fullname}</p>}

          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="error-message">{errors.email}</p>}

          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter Your Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p className="error-message">{errors.password}</p>}

          <button type="submit">Register</button>
        </form>
        {errors.general && <p className="error-message">{errors.general}</p>}
        <div className="login-link">
          <p>Already a User? <Link to="/userlogin">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
