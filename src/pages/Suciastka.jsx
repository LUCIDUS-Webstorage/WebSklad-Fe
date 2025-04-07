import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import './Suciastka.css';

const Suciastka = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const part = state?.part;

    if (!part) {
        navigate('/');
        return null;
    }

    return (
        <div className="suciastka-container">
            <div className="suciastka-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    ← Späť na zoznam
                </button>
                <h1>{part.name}</h1>
            </div>

            <div className="suciastka-main-content">
                <div className="suciastka-image-section">
                    <div className="image-placeholder">
                        <span>Obrázok súčiastky</span>
                    </div>
                </div>

                <div className="suciastka-info-section">
                    <div className="price-section">
                        <h2>{part.value} €</h2>
                        <p className="price-without-vat">(bez DPH: {(parseFloat(part.value) * 0.8).toFixed(2)}€)</p>
                    </div>

                    <div className="stock-info">
                        <p>Na sklade: {part.count} ks</p>
                    </div>

                    <div className="action-buttons">
                        <button 
                            className="add-to-list-btn"
                            onClick={() => alert(`Súčiastka ${part.name} bola pridaná do zoznamu`)}
                        >
                            Pridať do zoznamu
                        </button>
                        <button className="favorite-btn">
                            Pridať medzi obľúbené
                        </button>
                    </div>

                    <div className="details-section">
                        <p><strong>Katalógové číslo:</strong> {part.part_id}</p>
                        <p><strong>Kategória:</strong> {part.category || "Nešpecifikované"}</p>
                    </div>
                </div>
            </div>

            <div className="suciastka-description">
                <h3>Popis súčiastky</h3>
                <p>Funguje</p>
            </div>
        </div>
    );
};

export default Suciastka;