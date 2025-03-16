import React, { useEffect, useState } from "react";

const Home = () => {
    const [parts, setParts] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/parts/list")
            .then(response => response.json())
            .then(data => setParts(data))
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", padding: "20px" }}>
            {parts.map((part) => (
                <div key={part.id} style={{
                    border: "1px solid #ddd",
                    padding: "15px",
                    borderRadius: "8px",
                    boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
                    width: "200px",
                    textAlign: "center"
                }}>
                    <h3>{part.name}</h3>
                    <p><strong>Kategória:</strong> {part.category}</p>
                    <p><strong>Počet:</strong> {part.count}</p>
                    <button style={{
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        padding: "10px",
                        cursor: "pointer",
                        borderRadius: "5px",
                        marginTop: "10px"
                    }}>
                        Akcia
                    </button>
                </div>
            ))}
        </div>
    );
};

export default Home;
