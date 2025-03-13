import { useState, useEffect } from "react";
import "./Dashboard.css"; // Import CSS

const Dashboard = () => {
  const [parts, setParts] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/parts/list")
      .then((response) => response.json())
      .then((data) => setParts(data))
      .catch((error) => console.error("Error fetching parts:", error));
  }, []);

  const updatePartQuantity = (index, newQuantity) => {
    const updatedParts = [...parts];
    updatedParts[index].stock = newQuantity;
    setParts(updatedParts);
  };

  const deletePart = (index) => {
    const updatedParts = parts.filter((_, i) => i !== index);
    setParts(updatedParts);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>LUCIDUS 📦</h1>
        <input type="text" placeholder="Hľadať..." className="search-input" />
        <span>Jožko Mrkva</span>
      </header>
      <div className="parts-grid">
        {parts.map((part, index) => (
          <div key={index} className="part-card">
            <h3 className="part-name">{part.name}</h3>
            <div className="part-actions">
              <button
                className="button minus-btn"
                onClick={() => updatePartQuantity(index, Math.max(0, part.stock - 1))}
              >
                ➖
              </button>
              <input
                type="number"
                value={part.stock}
                onChange={(e) => updatePartQuantity(index, Math.max(0, parseInt(e.target.value) || 0))}
              />
              <button
                className="button plus-btn"
                onClick={() => updatePartQuantity(index, part.stock + 1)}
              >
                ➕
              </button>
            </div>
            <button className="button delete-btn" onClick={() => deletePart(index)}>
              🗑 Odstrániť
            </button>
            <button className="button cart-btn" onClick={() => console.log("Pridať do košíka", part)}>
              🛒 Pridať do košíka
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
