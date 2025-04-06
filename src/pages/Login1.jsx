import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import './Login1.css';

const Login1 = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTeacher, setIsTeacher] = useState(true); // true = učiteľ, false = žiak

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isTeacher) {
        // Len pre učiteľa - odoslanie na backend
        const response = await fetch('http://127.0.0.1:8000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: credentials.username,
            password: credentials.password
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Nesprávne prihlasovacie údaje');
        }

        console.log('Prijatý token:', data.token); // Vypíše token do konzoly
        localStorage.setItem('token', data.token);
      } else {
        // Pre žiaka - len presmerovanie bez tokenu
        console.log('Žiak sa prihlásil bez tokenu');
      }

      navigate('/home');
    } catch (err) {
      console.error('Chyba pri prihlásení:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="role-selector">
        <button
          className={isTeacher ? 'active' : ''}
          onClick={() => setIsTeacher(true)}
          type="button"
        >
          Učiteľ
        </button>
        <button
          className={!isTeacher ? 'active' : ''}
          onClick={() => setIsTeacher(false)}
          type="button"
        >
          Žiak
        </button>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        {isTeacher ? (
          <>
            <div className="form-group">
              <p>Prihlasovacie meno:</p>
              <input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <p>Heslo:</p>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
              />
            </div>
          </>
        ) : (
          <div className="form-group">
            <p>Tvoje meno:</p>
            <input
              type="text"
              name="name"
              value={credentials.name}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Prihlasovanie...' : 'Prihlásiť sa →'}
        </button>
      </form>
    </div>
  );
};

export default Login1;