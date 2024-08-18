import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://statuscode-image.onrender.com/login', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const { fullname, email, userId } = response.data.existingUser;

        const userProfile = { fullname, email, userId };
        console.log('Profile:', userProfile);
        localStorage.setItem('profile', JSON.stringify(userProfile));
        navigate('/searchresponsecode');
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      setError('Error logging in. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={styles.background}>
      {/* <h1 style={styles.appTitle}>Status Code App</h1> */}
      <div style={styles.loginBox}>
        <h2 style={styles.title}>Login</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label} htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
          />
          <label style={styles.label} htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
          />
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.button}>Login</button>
        </form>
        <div className="login-link" style={styles.link}>
          <p>Didn't Signup? <Link to="/userregister" style={styles.registerLink}>Register</Link></p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  background: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundImage: 'linear-gradient(to bottom right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3)), url(https://the7eagles.com/wp-content/uploads/2022/09/HTTP-Status-Code.webp)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  loginBox: {
    width: '500px',
    padding: '30px',
    borderRadius: '15px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
    backdropFilter: 'blur(10px)', // Adds a subtle blur to the background content for a frosted glass effect
  },
  appTitle: {
    fontSize: '36px',
    marginBottom: '30px',
    color: '#333333',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '2px',
  },
  title: {
    fontSize: '35px',
    marginBottom: '25px',
    color: '#45A049',
    fontStyle: 'italic',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '8px',
    fontSize: '18px',
    color: '#333333',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  input: {
    padding: '12px',
    marginBottom: '15px',
    borderRadius: '8px',
    border: '1px solid #cccccc',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  button: {
    padding: '12px 25px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#4CAF50',
    color: '#ffffff',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#45A049',
  },
  error: {
    color: '#FF0000',
    marginBottom: '15px',
    fontSize: '14px',
  },
  link: {
    marginTop: '20px',
  },
  registerLink: {
    color: '#4CAF50',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

export default Login;
