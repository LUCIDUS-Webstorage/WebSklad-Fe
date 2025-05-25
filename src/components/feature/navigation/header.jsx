import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import styles from './header.module.css';

const Header = ({ onSearchResults = () => {} }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/parts/search/${query}`);
      if (!response.ok) {
        throw new Error('Chyba pri načítaní dát');
      }
      const data = await response.json();
      const resultsArray = Array.isArray(data) ? data : [data];
      onSearchResults(resultsArray);
    } catch (error) {
      console.error('Chyba pri vyhľadávaní:', error);
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        navigate('/');
        return;
      }

      const response = await fetch('http://127.0.0.1:8000/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        }
      });

      if (response.ok) {
        console.log('Logged out successfully');
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        localStorage.removeItem('cart');
        navigate('/');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className={styles.header}>
      <div className={styles.left}>
        <NavLink to="/home" className={styles.title}>LUCIDUS</NavLink>
      </div>
      <div className={styles["search-container"]}>
        <input
          type="text"
          placeholder="Hľadať..."
          className={styles["search-box"]}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button className={styles["search-button"]} onClick={handleSearch}>🔍</button>
      </div>
      <div className={styles.buttons}>
        <NavLink className={styles["profile-button"]} to={'/Ucet'}>
          {localStorage.getItem('username') || 'Užívateľ'} 👤
        </NavLink>
        <NavLink className={styles["logout-button"]} to="/" onClick={handleLogout}>Odhlásiť sa</NavLink>
      </div>
    </div>
  );
};

export default Header;