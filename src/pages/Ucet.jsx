import React, { useState } from 'react';
import './Ucet.css';
import Header from "../components/feature/navigation/header";

const Ucet = () => {
  const [activeTab, setActiveTab] = useState('notifications');
  const [historyData, setHistoryData] = useState([]);
  const [borrowedData, setBorrowedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Nenašiel sa token');
      }

      const response = await fetch('http://127.0.0.1:8000/history', {
        method: 'GET',
        headers: {
          'token': token
        }
      });

      if (!response.ok) {
        throw new Error('Nepodarilo sa načítať históriu');
      }

      const data = await response.json();
      setHistoryData(data);
    } catch (err) {
      console.error('Chyba pri načítaní histórie:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBorrowed = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Nenašiel sa token');
      }

      const response = await fetch('http://127.0.0.1:8000/parts/borrowed/list', {
        method: 'GET',
        headers: {
          'token': token
        }
      });

      if (!response.ok) {
        throw new Error('Nepodarilo sa načítať vypožičané súčiastky');
      }

      const data = await response.json();
      setBorrowedData(data);
    } catch (err) {
      console.error('Chyba pri načítaní vypožičaných súčiastok:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'history') {
      fetchHistory();
    } else if (tab === 'borrowed') {
      fetchBorrowed();
    }
  };

  const formatDateTime = (datetime) => {
    if (!datetime) return ['', ''];
    const [date, time] = datetime.split(' ');
    return [date, time];
  };

  return (
    <>
      <Header />
      <div className="ucet-container">
        <div className="left-menu">
          <div className="profile-section">
            <div className="avatar">JM</div>
            <h2>Jozko Mrkva</h2>
          </div>
          
          <button className="logout-button">Odhlásiť sa</button>
          
          <div className="divider"></div>
          
          <div className="menu-items">
            <button 
              className={`menu-button ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => handleTabClick('notifications')}
            >
              Upozornenia
            </button>
            <button 
              className={`menu-button ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => handleTabClick('history')}
            >
              História
            </button>
            <button 
              className={`menu-button ${activeTab === 'borrowed' ? 'active' : ''}`}
              onClick={() => handleTabClick('borrowed')}
            >
              Vypožičané
            </button>
          </div>
        </div>

        <div className="right-content">
          {loading && <div className="loading">Načítavam...</div>}
          {error && <div className="error">{error}</div>}

          {activeTab === 'history' && (
            <div className="history-table">
              <table>
                <thead>
                  <tr>
                    <th>Prihlasovacie meno</th>
                    <th>Typ operácie</th>
                    <th>Dátum</th>
                    <th>Čas</th>
                  </tr>
                </thead>
                <tbody>
                  {historyData.map((item, index) => {
                    const [date, time] = formatDateTime(item.time);
                    return (
                      <tr key={index}>
                        <td>{item.user_id}</td>
                        <td>{item.operation}</td>
                        <td>{date}</td>
                        <td>{time}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'borrowed' && (
            <div className="borrowed-table">
              <table>
                <thead>
                  <tr>
                    <th>Názov súčiastky</th>
                    <th>Počet vypožičaných (ks)</th>
                  </tr>
                </thead>
                <tbody>
                  {borrowedData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.part_id}</td>
                      <td>{item.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div >
              {/* Prázdny obsah pre upozornenia */}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Ucet;