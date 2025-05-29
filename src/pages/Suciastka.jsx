import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import './Suciastka.css';
import Zoznam from './Zoznam';

const Suciastka = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const part = state?.part;
    const [image, setImage] = useState(null);
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        if (!part) {
            navigate('/');
            return;
        }

        fetch(`http://127.0.0.1:8000/image/${part.part_id}`)
            .then(response => {
                if (response.ok) return response.blob();
                return null;
            })
            .then(blob => {
                if (blob) {
                    const imageUrl = URL.createObjectURL(blob);
                    setImage(imageUrl);
                }
            })
            .catch(error => console.error("Chyba pri načítaní obrázka:", error));

        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart, part, navigate]);

    if (!part) {
        return null;
    }

    const addToCart = () => {
        const newItem = {
            ...part,
            count: 1,
            uniqueKey: `${part.part_id}-${Date.now()}`
        };
        setCart([...cart, newItem]);
    };

    const updateCount = (uniqueKey, change) => {
        setCart(cart.map(item =>
            item.uniqueKey === uniqueKey ? { ...item, count: Math.max(1, item.count + change) } : item
        ));
    };

    const removeFromCart = (uniqueKey) => {
        setCart(cart.filter(item => item.uniqueKey !== uniqueKey));
    };

    return (
        <div className="container">
            <Zoznam 
                cart={cart} 
                updateCount={updateCount} 
                removeFromCart={removeFromCart} 
                setCart={setCart} 
            />
            
            <div className="content">
                <div className="suciastka-container">
                    <button className="back-button" onClick={() => navigate(-1)}>
                        ← Späť na zoznam
                    </button>

                    <div className="suciastka-main-content">
                        <div className="suciastka-image-section89">
                            {image ? (
                                <img 
                                    src={image} 
                                    alt={part.name} 
                                    className="suciastka-image89"
                                />
                            ) : (
                                <div className="image-placeholder89">
                                    <span>Obrázok súčiastky</span>
                                </div>
                            )}
                        </div>

                        <div className="suciastka-info-section">
                            <div className="suciastka-title">
                                <h1>{part.name}</h1>
                                <span className="suciastka-value">{part.value}</span>
                            </div>

                            {/* Pridané kategórie pod názov */}
                            <div className="suciastka-categories">
                                {part.category && (
                                    <p className="category-info"><strong>Kategória:</strong> {part.category}</p>
                                )}
                                {part.sub_category && (
                                    <p className="subcategory-info"><strong>Podkategória:</strong> {part.sub_category}</p>
                                )}
                            </div>
                            
                            <p className="stock-info">Počet: {part.count} ks</p>

                            <button 
                                className="add-to-list-btn"
                                onClick={addToCart}
                            >
                                Pridať do zoznamu
                            </button>
                        </div>
                    </div>

                    <div className="separator"></div>

                    <div className="suciastka-description">
                        <h3>Popis:</h3>
                        <p>{part.description || 'Popis nie je dostupný'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Suciastka;