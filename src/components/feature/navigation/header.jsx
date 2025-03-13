import React from 'react';
import './header.css'; // Importujeme CSS súbor

const Header = () => {
  const goToUcet = () => {
    // Funkcia pre navigáciu na stránku účtu
    console.log('Navigating to account page...');
  };

  return (
    <div className="header">
      <div className="left">
        <span className="title">LUCIDUS</span>
      </div>
      <div className="search-container">
        <input type="text" placeholder="Hľadať..." className="search-box" />
        <button className="search-button">🔍</button>
      </div>
      <div className="buttons">
        <button className="icon-button" onClick={goToUcet}>Ronnie Coleman 👤</button>
        <button className="icon-button">🔔</button>
      </div>
    </div>
  );
};

export default Header;