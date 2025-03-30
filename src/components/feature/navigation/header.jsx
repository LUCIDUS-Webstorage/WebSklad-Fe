import React, { useState } from 'react';
import { NavLink } from 'react-router'; 
import styles from './header.module.css';

const Header = ({ onSearchResults = () => {} }) => {
  const [query, setQuery] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/parts/search/${query}`);
      if (!response.ok) {
        throw new Error('Chyba pri načítaní dát');
      }
      const data = await response.json();

      // Konvertujeme odpoveď na pole, ak je objekt
      const resultsArray = Array.isArray(data) ? data : [data];

      // Extrahujeme len name, value a count
      const filteredResults = resultsArray.map(part => ({
        name: part.name,
        value: part.value,
        count: part.count
      }));

      onSearchResults(filteredResults);
    } catch (error) {
      console.error('Chyba pri vyhľadávaní:', error);
    }
  };

  return (
    <div className={styles["header"]}>
      <div className={styles["left"]}>
        <span className={styles["title"]}>LUCIDUS</span>
      </div>
      <div className={styles["search-container"]}>
        <input
          type="text"
          placeholder="Hľadať..."
          className={styles["search-box"]}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()} // Opravené onKeyPress -> onKeyDown (nový štandard)
        />
        <button className={styles["search-button"]} onClick={handleSearch}>🔍</button>
      </div>
      <div className={styles["buttons"]}>
        <NavLink className={styles["icon-button"]} to={'/Ucet'}>Ronnie Coleman 👤</NavLink>
        <button className={styles["icon-button"]}>🔔</button>
      </div>
    </div>
  );
};

export default Header;
