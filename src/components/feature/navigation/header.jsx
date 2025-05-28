import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router';
import styles from './header.module.css';

const Header = ({ onSearchResults = () => {} }) => {
  const [query, setQuery] = useState('');
  const [hasToken, setHasToken] = useState(false);
  const navigate = useNavigate();

  // Kontrola tokenu pri načítaní komponenty
  useEffect(() => {
    const token = localStorage.getItem('token');
    setHasToken(!!token);
  }, []);

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
        setHasToken(false); // Aktualizujeme stav
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
      
      {/* Search sa zobrazuje vždy */}
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
        {/* Nové tlačidlo pre Schémy - zobrazuje sa vždy */}
        <NavLink className={styles["schemy-button"]} to="/Schemy">
          Schémy
        </NavLink>
        
        {/* Účet button sa zobrazuje len ak má token */}
        {hasToken && (
          <NavLink className={styles["profile-button"]} to={'/Ucet'}>
            {localStorage.getItem('username') || 'Užívateľ'} 👤
          </NavLink>
        )}
        
        {/* Logout/Odísť button sa zobrazuje vždy */}
        <NavLink 
          className={styles["logout-button"]} 
          to="/" 
          onClick={hasToken ? handleLogout : undefined}
        >
          {hasToken ? 'Odhlásiť sa' : 'Odísť'}
        </NavLink>
      </div>
    </div>
  );
};

export default Header;