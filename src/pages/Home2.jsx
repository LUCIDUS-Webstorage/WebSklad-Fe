import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router';
import "./Home2.css"; // Import CSS
import Header from "../components/feature/navigation/header";

const Home2 = () => {
    const [parts, setParts] = useState([]); // Súčiastky z API
    const [cart, setCart] = useState([]);   // Súčiastky v zozname
    const [searchResults, setSearchResults] = useState([]); // Výsledky vyhľadávania
    const [filteredParts, setFilteredParts] = useState([]); // Súčiastky podľa kategórie
    const [currentCategory, setCurrentCategory] = useState(''); // Aktuálna kategória
    const [images, setImages] = useState({}); // Mapa obrázkov podľa part_id

    useEffect(() => {
        fetch("http://127.0.0.1:8000/parts/list")
            .then(response => response.json())
            .then(data => {
                setParts(data);
                // Načítaj obrázky pre všetky súčiastky
                data.forEach(part => {
                    fetchImage(part.part_id);
                });
            })
            .catch(error => console.error("Chyba pri fetchnutí:", error));
    }, []);

    // Funkcia na načítanie obrázka
    const fetchImage = (partId) => {
        fetch(`http://127.0.0.1:8000/image/${partId}`)
            .then(response => {
                if (response.ok) {
                    return response.blob();
                }
                return null;
            })
            .then(blob => {
                if (blob) {
                    const imageUrl = URL.createObjectURL(blob);
                    setImages(prev => ({
                        ...prev,
                        [partId]: imageUrl
                    }));
                }
            })
            .catch(error => console.error("Chyba pri načítaní obrázka:", error));
    };

    // Funkcia na pridanie súčiastky do zoznamu
    const addToCart = (part) => {
        const newItem = {
            ...part,
            count: 0,
            uniqueKey: `${part.part_id}-${Date.now()}` // Unikátny kľúč
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

    const navigate = useNavigate();


    // Funkcia na spracovanie vyhľadávania
    const handleSearchResults = (results) => {
        setSearchResults(results);
    // Načítaj obrázky pre výsledky vyhľadávania
            results.forEach(part => {
            if (!images[part.part_id]) {
                fetchImage(part.part_id);
            }
        });
    };

    // Funkcia na filtrovanie podľa kategórie
    const handleCategoryFilter = async (category) => {
        setCurrentCategory(category); // Nastavíme aktuálnu kategóriu

        try {
            const response = await fetch(`http://127.0.0.1:8000/parts/search/category/${category}`);
            if (!response.ok) {
                throw new Error('Chyba pri načítaní dát');
            }
            const data = await response.json();
            setFilteredParts(data); // Uložíme súčiastky pre danú kategóriu
            // Načítaj obrázky pre filtrované súčiastky
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

                {/* Kategórie */}
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

                    {/* Dynamicky zmenený nadpis */}
                    <h2>{searchResults.length > 0 ? 'Výsledky vyhľadávania' : currentCategory ? `${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)} ` : 'Zoznam súčiastok'}</h2>

                    {/* Zoznam súčiastok alebo výsledky vyhľadávania */}
                    <div className="suciastky-grid">
                        {(searchResults.length > 0 ? searchResults : (filteredParts.length > 0 ? filteredParts : parts)).map((part) => (
                            <div className="suciastka-box" key={part.part_id} onClick={() =>  handleSuciastkaClick(part)}>
                                {images[part.part_id] && (
                                    <img 
                                        src={images[part.part_id]} 
                                        alt={part.name} 
                                        className="suciastka-image"
                                        onError={(e) => {
                                            e.target.style.display = 'none'; // Skryť obrázok ak sa nepodarí načítať
                                        }}
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