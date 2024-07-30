import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('profile'));

  return (
    <nav style={styles.navbar}>
      <div style={styles.leftSection}>
        <div style={styles.userSection}>
          <img src='./assets/images/user_icon.png' alt="User Icon" style={styles.userIcon} />
          <div style={styles.userInfo}>
            <p>{user.fullname}</p>
            <p>{user.email}</p>
          </div>
        </div>
      </div>
      <div style={styles.rightSection}>
        <Link to="/SavedList" style={styles.link}>Saved List</Link>
        <div style={styles.underline}></div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    backgroundColor: '#007bff', 
    color: '#fff', 
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
  },
  userIcon: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    marginRight: '10px',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginRight: '10px',
  },
  rightSection: {
    position: 'relative', 
  },
  link: {
    color: '#000',
    textDecoration: 'none',
    position: 'relative',
  },
  underline: {
    position: 'absolute',
    bottom: '-2px',
    left: '0',
    width: '100%',
    height: '2px',
    backgroundColor: '#000', 
  },
};

export default Navbar;
