import React, { useState, useEffect } from 'react';
import './Zoznam.css';

const Zoznam = ({ cart, updateCount, removeFromCart, setCart }) => {
    const [hasToken, setHasToken] = useState(false);

    // Kontrola tokenu pri načítaní komponenty
    useEffect(() => {
        const token = localStorage.getItem('token');
        setHasToken(!!token);
    }, []);

    const handleBorrow = async () => {
        if (cart.length === 0) return;

        const token = localStorage.getItem('token');
        
        if (!token) {
            alert('Pre vykonanie tejto akcie sa musíte prihlásiť ako učiteľ!');
            return;
        }

        const partIds = cart.map(item => item.part_id).join(',');
        const counts = cart.map(item => item.count).join(',');

        try {
            const response = await fetch(`http://127.0.0.1:8000/parts/borrow/${partIds}/${counts}`, {
                method: 'POST',
                headers: {
                    'token': token,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Chyba pri vykonávaní požiadavky');
            }

            setCart([]);
            alert('Súčiastky boli úspešne vybrané');
        } catch (error) {
            console.error('Chyba:', error);
            alert(`Nastala chyba: ${error.message}`);
        }
    };

    return (
        <div className="sidebar">
            <h2>Zoznam súčiastok 🛒</h2>
            <div className="component-list">
                {cart.length > 0 ? (
                    <>
                        {cart.map((item) => (
                            <div className="component-item" key={item.uniqueKey}>
                                <span>{item.name} {item.value}</span>
                                <div className="counter">
                                    <button onClick={() => updateCount(item.uniqueKey, -1)}>➖</button>
                                    <input type="text" value={item.count} readOnly />
                                    <button onClick={() => updateCount(item.uniqueKey, 1)}>➕</button>
                                </div>
                                <button className="delete-btn" onClick={() => removeFromCart(item.uniqueKey)}>🗑️</button>
                            </div>
                        ))}
                        {/* Tlačidlo sa zobrazuje len ak má token */}
                        {hasToken && (
                            <button 
                                className="borrow-btn"
                                onClick={handleBorrow}
                                disabled={cart.length === 0}
                            >
                                Vybrať súčiastky
                            </button>
                        )}
                    </>
                ) : (
                    <p>Žiadne súčiastky v zozname.</p>
                )}
            </div>
        </div>
    );
};

export default Zoznam;