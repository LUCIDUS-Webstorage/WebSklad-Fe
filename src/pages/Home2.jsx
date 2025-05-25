import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router';
import "./Home2.css";
import Header from "../components/feature/navigation/header";
import Zoznam from "./Zoznam";

//Creating constants
const Home2 = () => {
    const [parts, setParts] = useState([]);
    const [cart, setCart] = useState(() => {
        // Načítanie košíka z localStorage pri inicializácii
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [searchResults, setSearchResults] = useState([]);
    const [filteredParts, setFilteredParts] = useState([]);
    const [currentCategory, setCurrentCategory] = useState('');
    const [images, setImages] = useState({});

    // Uloženie košíka do localStorage pri každej zmene
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/parts/list")
            .then(response => response.json())
            .then(data => {
                setParts(data);
                data.forEach(part => {
                    fetchImage(part.part_id);
                });
            })
            .catch(error => console.error("Chyba pri fetchnutí:", error));
    }, []);

    const fetchImage = (partId) => {
        fetch(`http://127.0.0.1:8000/image/${partId}`)
            .then(response => {
                if (response.ok) return response.blob();
                return null;
            })
            .then(blob => {
                if (blob) {
                    const imageUrl = URL.createObjectURL(blob);
                    setImages(prev => ({ ...prev, [partId]: imageUrl }));
                }
            })
            .catch(error => console.error("Chyba pri načítaní obrázka:", error));
    };

    const addToCart = (part) => {
        const newItem = {
            ...part,
            count: 1, // Zmenené z 0 na 1, lebo väčšinou pridávame 1 kus
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

    const navigate = useNavigate();

    const handleSearchResults = (results) => {
        setSearchResults(results);
        results.forEach(part => {
            if (!images[part.part_id]) {
                fetchImage(part.part_id);
            }
        });
    };

    const handleCategoryFilter = async (category) => {
        setCurrentCategory(category);
        try {
            const response = await fetch(`http://127.0.0.1:8000/parts/search/category/${category}`);
            if (!response.ok) throw new Error('Chyba pri načítaní dát');
            const data = await response.json();
            setFilteredParts(data);
            data.forEach(part => {
                if (!images[part.part_id]) {
                    fetchImage(part.part_id);
                }
            });
        } catch (error) {
            console.error('Chyba pri filtrovaní podľa kategórie:', error);
        }
    };

    const handleSuciastkaClick = (part) => {
        navigate('/Suciastka', { state: { part } });
    };

    return (
        <>
            <Header onSearchResults={handleSearchResults} />
            <div className="container">
                <Zoznam cart={cart} updateCount={updateCount} removeFromCart={removeFromCart} setCart={setCart} />
                
                <div className="content">
                    <div className="categories">
                        {['Pasívne súčiastky', 'Aktívne súčiastky', 'Mikrokontroléry', 'Logické prvky','Komponenty','Sety'].map((category, index) => (
                            <div className="category-card" key={index}>
                                <button onClick={() => handleCategoryFilter(category.toLowerCase())}>
                                    {category}
                                </button>
                            </div>
                        ))}
                    </div>

                    <h2>{searchResults.length > 0 ? 'Výsledky vyhľadávania' : currentCategory ? `${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)} ` : 'Zoznam súčiastok'}</h2>

                    <div className="suciastky-grid">
                        {(searchResults.length > 0 ? searchResults : (filteredParts.length > 0 ? filteredParts : parts)).map((part) => (
                            <div className="suciastka-box" key={part.part_id} onClick={() => handleSuciastkaClick(part)}>
                                {images[part.part_id] && (
                                    <img 
                                        src={images[part.part_id]} 
                                        alt={part.name} 
                                        className="suciastka-image"
                                        onError={(e) => e.target.style.display = 'none'}
                                    />
                                )}
                                <h3>{part.name}</h3>
                                <p><strong>Hodnota:</strong> {part.value}</p>
                                <p><strong>Počet:</strong> {part.count} ks</p>
                                <button className="add-btn" onClick={(e) => {e.stopPropagation(); addToCart(part);}}>Pridať</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home2;