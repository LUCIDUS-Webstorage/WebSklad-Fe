import { useState, useEffect } from "react";

const PartsTest = () => {
  const [parts, setParts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/parts/list", {
      method: "GET",
      mode: "cors", // Povolenie CORS
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setParts(data))
      .catch((error) => setError(error.message));
  }, []);

  return (
    <div>
      <h2>Test API Fetch</h2>
      {error ? (
        <p style={{ color: "red" }}>Chyba: {error}</p>
      ) : parts.length > 0 ? (
        <ul>
          {parts.map((part, index) => (
            <li key={index}>{part.name} - {part.stock} ks</li>
          ))}
        </ul>
      ) : (
        <p>Načítavam dáta...</p>
      )}
    </div>
  );
};

export default PartsTest;
