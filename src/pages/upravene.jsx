import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import styles from './Upravene.module.css';
import Header from "../components/feature/navigation/header";

const Upravene = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const part = state?.part;
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    sub_category: '',
    name: '',
    value: '',
    count: '',
    min_count: ''
  });

  useEffect(() => {
    if (!part) {
      navigate('/ucet');
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

    setFormData({
      category: part.category,
      sub_category: part.sub_category || '',
      name: part.name,
      value: part.value,
      count: part.count,
      min_count: part.min_count || ''
    });
  }, [part, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/parts/update/${part.part_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify({
          category: formData.category,
          sub_category: formData.sub_category || null,
          name: formData.name,
          value: formData.value,
          count: parseInt(formData.count),
          min_count: formData.min_count ? parseInt(formData.min_count) : null
        })
      });

      if (response.ok) {
        navigate('/ucet');
      }
    } catch (error) {
      console.error('Chyba pri úprave súčiastky:', error);
    }
  };

  if (!part) {
    return null;
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <button className={styles.backButton} onClick={() => navigate('/ucet')}>
          ← Späť na účet
        </button>

        <div className={styles.mainContent}>
          <div className={styles.imageSection}>
            {image ? (
              <img 
                src={image} 
                alt={part.name} 
                className={styles.partImage}
              />
            ) : (
              <div className={styles.imagePlaceholder}>
                <span>Obrázok súčiastky</span>
              </div>
            )}
          </div>

          <div className={styles.formSection}>
            <h1>Upraviť súčiastku</h1>
            
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Kategória:</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Podkategória:</label>
                <input
                  type="text"
                  name="sub_category"
                  value={formData.sub_category}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Názov:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Hodnota:</label>
                <input
                  type="text"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Počet:</label>
                <input
                  type="number"
                  name="count"
                  value={formData.count}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Minimálny počet:</label>
                <input
                  type="number"
                  name="min_count"
                  value={formData.min_count}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <button type="submit" className={styles.submitButton}>
                Potvrdiť zmeny
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Upravene;