import React from 'react';
import './Home2.css'; // Import the CSS file

const Home2 = () => {
  const handleCategoryClick = (categoryName) => {
    alert(`Klikli ste na kategóriu: ${categoryName}`);
    // Add additional logic here if needed
  };

  return  (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Zoznam súčiastok 🛒</h2>
        <div className="component-list">
          {/* Prvých 6 súčiastok */}
          {[...Array(6)].map((_, index) => (
            <div className="component-item" key={index}>
              <span>Label</span>
              <button>⚙️</button>
              <button>🗑️</button>
            </div>
          ))}
        </div>
      </div>

      {/* Kategórie a súčiastky */}
      <div className="content">
        <div className="categories">
          {[
            'Pasívne súčiastky',
            'Aktívne súčiastky',
            'Mikrokontroléry',
            'Logické prvky',
            'Headline',
            'Headline',
          ].map((category, index) => (
            <div className="category-card" key={index}>
              <button onClick={() => handleCategoryClick(category)}>{category}</button>
            </div>
          ))}
        </div>

        {/* Placeholder for parts list */}
        <div>
          <h2>Parts List</h2>
          <p>No parts available.</p>
        </div>
      </div>
    </div>
  );
};

export default Home2;