import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import './Login1.css';
import logo from '../pictures/Lucidus_logo.png';

const Login1 = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTeacher, setIsTeacher] = useState(true);

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
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/login`, {
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

        localStorage.setItem('token', data.token);
        localStorage.setItem('username', credentials.username);
        localStorage.setItem('role', 'teacher');
      } else {
        localStorage.setItem('username', credentials.name);
        localStorage.setItem('role', 'student');
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
    <div className="login-page">
      <div className="login-header">
        <img src={logo} alt="Lucidus Logo" className="login-logo" />
      </div>
      
      <div className="login-content">
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
                <label>Prihlasovacie meno:</label>
                <input
                  type="text"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Heslo:</label>
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
              <label>Tvoje meno:</label>
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
    </div>
  );
};

export default Login1;