import React, { useEffect, useState } from "react";
import "./Home2.css"; // Import CSS

const Home2 = () => {
    const [parts, setParts] = useState([]); // Súčiastky z API
    const [cart, setCart] = useState([]);   // Súčiastky v zozname

    useEffect(() => {
        fetch("http://127.0.0.1:8000/parts/list")
            .then(response => response.json())
            .then(data => setParts(data))
            .catch(error => console.error("Chyba pri fetchnutí:", error));
    }, []);

    // Funkcia na pridanie súčiastky do zoznamu
    const addToCart = (part) => {
        // Pridáme novú položku so štartovacím počtom 0 a unikátnym kľúčom
        const newItem = {
            ...part,
            count: 0,
            uniqueKey: `${part.part_id}-${Date.now()}` // Unikátny kľúč: part_id + timestamp
        };
        setCart([...cart, newItem]);
    };

    // Funkcia na zmenu počtu (+ alebo -)
    const updateCount = (uniqueKey, change) => {
        setCart(cart.map(item =>
            item.uniqueKey === uniqueKey ? { ...item, count: Math.max(0, item.count + change) } : item
        ));
    };

    // Funkcia na odstránenie súčiastky zo zoznamu
    const removeFromCart = (uniqueKey) => {
        setCart(cart.filter(item => item.uniqueKey !== uniqueKey));
    };

    return (
        <div className="container">
            {/* Sidebar - Zoznam vybraných súčiastok */}
            <div className="sidebar">
                <h2>Zoznam súčiastok 🛒</h2>
                <div className="component-list">
                    {cart.length > 0 ? (
                        cart.map((item) => (
                            <div className="component-item" key={item.uniqueKey}>
                                <span>{item.name} {item.value}</span>
                                <div className="counter">
                                    <button onClick={() => updateCount(item.uniqueKey, -1)}>➖</button>
                                    <input type="text" value={item.count} readOnly />
                                    <button onClick={() => updateCount(item.uniqueKey, 1)}>➕</button>
                                </div>
                                <button className="delete-btn" onClick={() => removeFromCart(item.uniqueKey)}>🗑️</button>
                            </div>
                        ))
                    ) : (
                        <p>Žiadne súčiastky v zozname.</p>
                    )}
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
                            <button>{category}</button>
                        </div>
                    ))}
                </div>

                <h2>Zoznam súčiastok</h2>
                <div className="suciastky-grid">
                    {parts.map((part) => (
                        <div className="suciastka-box" key={part.part_id}>
                            <h3>{part.name}</h3>
                            <p><strong>Hodnota:</strong> {part.value}</p>
                            <p><strong>Počet:</strong> {part.count} ks</p>
                            <button className="add-btn" onClick={() => addToCart(part)}>Pridať</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home2;