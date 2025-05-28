import React, { useState, useEffect } from "react";
import styles from "./Schemy.module.css";
import Header from "../components/feature/navigation/header";
import Zoznam from "./Zoznam";

const Schemy = () => {
    const [schemas, setSchemas] = useState([]);
    const [schemaImages, setSchemaImages] = useState({});
    const [partsData, setPartsData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Uloženie košíka
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    // Načítanie všetkých potrebných dát
    useEffect(() => {
        const objectUrls = [];
        let isMounted = true;

        const fetchAllData = async () => {
            try {
                // 1. Načítanie zoznamu schém
                const schemasResponse = await fetch('http://127.0.0.1:8000/schemas');
                if (!schemasResponse.ok) throw new Error('Chyba pri načítaní schém');
                const schemasData = await schemasResponse.json();

                // 2. Načítanie obrázkov schém
                const schemaImagesTemp = {};
                for (const schema of schemasData) {
                    const imageResponse = await fetch(`http://127.0.0.1:8000/schema/image/${schema.schema_id}`);
                    if (imageResponse.ok) {
                        const blob = await imageResponse.blob();
                        const imageUrl = URL.createObjectURL(blob);
                        objectUrls.push(imageUrl);
                        schemaImagesTemp[schema.schema_id] = imageUrl;
                    }
                }

                // 3. Zozbieranie všetkých unikátnych part_id
                const allPartIds = [...new Set(
                    schemasData.flatMap(schema => schema.parts.split(','))
                )];

                // 4. Načítanie detailov všetkých súčiastok naraz
                const partsTemp = {};
                const partDetailsPromises = allPartIds.map(async partId => {
                    const partResponse = await fetch(`http://127.0.0.1:8000/parts/list/${partId}`);
                    if (partResponse.ok) {
                        const partData = await partResponse.json();
                        
                        // Načítanie obrázka súčiastky
                        const imageResponse = await fetch(`http://127.0.0.1:8000/image/${partId}`);
                        if (imageResponse.ok) {
                            const imageBlob = await imageResponse.blob();
                            const imageUrl = URL.createObjectURL(imageBlob);
                            objectUrls.push(imageUrl);
                            partData.image = imageUrl;
                        }
                        
                        return { partId, partData };
                    }
                    return null;
                });

                const partDetailsResults = await Promise.all(partDetailsPromises);
                partDetailsResults.forEach(result => {
                    if (result) {
                        partsTemp[result.partId] = result.partData;
                    }
                });

                // 5. Pridanie počtov k súčiastkam podľa schém
                schemasData.forEach(schema => {
                    const partIds = schema.parts.split(',');
                    const partCounts = schema.part_counts.split(',');
                    
                    partIds.forEach((partId, index) => {
                        if (partsTemp[partId]) {
                            partsTemp[partId].requiredCount = parseInt(partCounts[index]);
                        }
                    });
                });

                if (isMounted) {
                    setSchemas(schemasData);
                    setSchemaImages(schemaImagesTemp);
                    setPartsData(partsTemp);
                    setLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message);
                    setLoading(false);
                }
            }
        };

        fetchAllData();

        return () => {
            isMounted = false;
            // Čistenie všetkých objektových URL
            objectUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, []);

    const addToCart = (part) => {
        const newItem = {
            ...part,
            count: part.requiredCount || 1,
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
        <>
            <Header />
            <div className={styles.container}>
                <Zoznam cart={cart} updateCount={updateCount} removeFromCart={removeFromCart} setCart={setCart} />
                
                <div className={styles.content}>
                    <h1>Schémy</h1>

                    {loading && <div className={styles.noResults}><p>Načítavam schémy...</p></div>}
                    {error && <div className={styles.noResults}><p className={styles.error}>Chyba: {error}</p></div>}

                    {schemas.map(schema => (
                        <div key={schema.schema_id} className={styles.schemaContainer}>
                            <div className={styles.schemaHeader}>
                                <h2>{schema.schema_name}</h2>
                                <p className={styles.schemaDescription}>{schema.schema_description}</p>
                            </div>
                            
                            {schemaImages[schema.schema_id] && (
                                <div className={styles.schemaImageContainer}>
                                    <img 
                                        src={schemaImages[schema.schema_id]} 
                                        alt={schema.schema_name} 
                                        className={styles.schemaImage}
                                    />
                                </div>
                            )}

                            <h3>Potrebné súčiastky:</h3>
                            <div className={styles.suciastkyGrid}>
                                {schema.parts.split(',').map((partId, index) => {
                                    const part = partsData[partId];
                                    if (!part) return null;
                                    
                                    return (
                                        <div key={`${schema.schema_id}-${partId}`} className={styles.suciastkaBox}>
                                            {part.image && (
                                                <img 
                                                    src={part.image} 
                                                    alt={part.name} 
                                                    className={styles.suciastkaImage}
                                                />
                                            )}
                                            <h3>{part.name}</h3>
                                            <p><strong>Hodnota:</strong> {part.value}</p>
                                            <p><strong>Počet:</strong> {part.requiredCount}</p>
                                            <button 
                                                className={styles.addBtn}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addToCart(part);
                                                }}
                                            >
                                                Pridať
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Schemy;