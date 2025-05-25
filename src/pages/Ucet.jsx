import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import styles from './Ucet.module.css';
import Header from "../components/feature/navigation/header";

const Ucet = () => {
  const [activeTab, setActiveTab] = useState('notifications');
  const [historyData, setHistoryData] = useState([]);
  const [borrowedData, setBorrowedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [addPartData, setAddPartData] = useState({
    category: '',
    sub_category: '',
    name: '',
    value: '',
    count: ''
  });
  const [deletePartData, setDeletePartData] = useState({
    name: '',
    value: ''
  });
  const [partsList, setPartsList] = useState([]);
  const [usersData, setUsersData] = useState({});
  const [usersList, setUsersList] = useState([]);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    rights: 'all'
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchPartsList();
  }, []);

  const fetchPartsList = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/parts/list');
      if (!response.ok) throw new Error('Failed to fetch parts list');
      const data = await response.json();
      setPartsList(data);
    } catch (err) {
      console.error('Error fetching parts list:', err);
    }
  };

  const fetchUsers = async (userIds) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/user/list/${userIds.join(',')}`, {
        headers: { 'token': token }
      });
      const data = await response.json();
      const usersMap = {};
      data.forEach(user => {
        usersMap[user.user_id] = user.username;
      });
      setUsersData(usersMap);
    } catch (error) {
      console.error('Chyba pri načítaní používateľov:', error);
    }
  };

  const fetchHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Nenašiel sa token');

      const response = await fetch('http://127.0.0.1:8000/history', {
        method: 'GET',
        headers: { 'token': token }
      });

      if (!response.ok) throw new Error('Nepodarilo sa načítať históriu');

      const data = await response.json();
      setHistoryData(data);
      const userIds = [...new Set(data.map(item => item.user_id))];
      await fetchUsers(userIds);
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
      if (!token) throw new Error('Nenašiel sa token');

      const response = await fetch('http://127.0.0.1:8000/parts/borrowed/list', {
        method: 'GET',
        headers: { 'token': token }
      });

      if (!response.ok) throw new Error('Nepodarilo sa načítať vypožičané súčiastky');

      const data = await response.json();
      setBorrowedData(data);
    } catch (err) {
      console.error('Chyba pri načítaní vypožičaných súčiastok:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersList = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/user/list/1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20', {
        headers: { 'token': token }
      });
      const data = await response.json();
      setUsersList(data);
    } catch (error) {
      console.error('Chyba pri načítaní používateľov:', error);
    }
  };

  const handleAddPart = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Nenašiel sa token');

      const response = await fetch('http://127.0.0.1:8000/parts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify({
          category: addPartData.category,
          sub_category: addPartData.sub_category || null,
          name: addPartData.name,
          value: addPartData.value,
          count: parseInt(addPartData.count)
        })
      });

      if (!response.ok) throw new Error('Nepodarilo sa pridať súčiastku');

      setAddPartData({
        category: '',
        sub_category: '',
        name: '',
        value: '',
        count: ''
      });
      fetchPartsList();
    } catch (err) {
      console.error('Chyba pri pridávaní súčiastky:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePart = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Nenašiel sa token');

      const partToDelete = partsList.find(part => 
        part.name === deletePartData.name && 
        part.value === deletePartData.value
      );

      if (!partToDelete) throw new Error('Súčiastka s daným názvom a hodnotou nebola nájdená');

      const response = await fetch(`http://127.0.0.1:8000/parts/delete/${partToDelete.part_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        }
      });

      if (!response.ok) throw new Error('Nepodarilo sa vymazať súčiastku');

      setDeletePartData({ name: '', value: '' });
      fetchPartsList();
    } catch (err) {
      console.error('Chyba pri vymazávaní súčiastky:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReturnPart = async (borrowedId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/parts/return/${borrowedId}`, {
        method: 'POST',
        headers: { 'token': token }
      });
      if (response.ok) {
        setBorrowedData(prev => prev.filter(item => item.borrowed_id !== borrowedId));
      }
    } catch (error) {
      console.error('Chyba pri vrátení súčiastky:', error);
    }
  };

  const handleReturnAll = async () => {
    try {
      const token = localStorage.getItem('token');
      const borrowedIds = borrowedData.map(item => item.borrowed_id).join(',');
      const response = await fetch(`http://127.0.0.1:8000/parts/return/${borrowedIds}`, {
        method: 'POST',
        headers: { 'token': token }
      });
      if (response.ok) {
        setBorrowedData([]);
      }
    } catch (error) {
      console.error('Chyba pri vrátení súčiastok:', error);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/user/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify(newUser)
      });
      if (response.ok) {
        setNewUser({ username: '', password: '', rights: 'all' });
        fetchUsersList();
      }
    } catch (error) {
      console.error('Chyba pri vytváraní používateľa:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/user/delete/${userId}`, {
        method: 'DELETE',
        headers: { 'token': token }
      });
      if (response.ok) {
        fetchUsersList();
      }
    } catch (error) {
      console.error('Chyba pri odstraňovaní používateľa:', error);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'history') fetchHistory();
    else if (tab === 'borrowed') fetchBorrowed();
    else if (tab === 'add_part') fetchPartsList();
    else if (tab === 'delete_part') fetchPartsList();
    else if (tab === 'users') fetchUsersList();
  };

  const formatDateTime = (datetime) => {
    if (!datetime) return ['', ''];
    const [date, time] = datetime.split(' ');
    return [date, time];
  };

  const handleAddPartChange = (e) => {
    const { name, value } = e.target;
    setAddPartData(prev => ({ ...prev, [name]: value }));
  };

  const handleDeletePartChange = (e) => {
    const { name, value } = e.target;
    setDeletePartData(prev => ({ ...prev, [name]: value }));
  };

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const response = await fetch('http://127.0.0.1:8000/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        }
      });

      if (response.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        localStorage.removeItem('cart');
        navigate('/');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <>
      <Header />
      <div className={styles["ucet-container"]}>
        <div className={styles["left-menu"]}>
          <div className={styles["profile-section"]}>
            <div className={styles.avatar}>
              {localStorage.getItem('username')?.charAt(0).toUpperCase() || 'JM'}
            </div>
            <h2>{localStorage.getItem('username') || 'Užívateľ'}</h2>
          </div>
          
          <button className={styles["logout-button"]} onClick={handleLogout}>Odhlásiť sa</button>
          
          <div className={styles.divider}></div>
          
          <div className={styles["menu-items"]}>
            <button 
              className={`${styles["menu-button"]} ${activeTab === 'notifications' ? styles.active : ''}`}
              onClick={() => handleTabClick('notifications')}
            >
              Upozornenia
            </button>
            <button 
              className={`${styles["menu-button"]} ${activeTab === 'history' ? styles.active : ''}`}
              onClick={() => handleTabClick('history')}
            >
              História
            </button>
            <button 
              className={`${styles["menu-button"]} ${activeTab === 'borrowed' ? styles.active : ''}`}
              onClick={() => handleTabClick('borrowed')}
            >
              Vypožičané
            </button>
            <button 
              className={`${styles["menu-button"]} ${activeTab === 'add_part' ? styles.active : ''}`}
              onClick={() => handleTabClick('add_part')}
            >
              Pridať súčiastku
            </button>
            <button 
              className={`${styles["menu-button"]} ${activeTab === 'delete_part' ? styles.active : ''}`}
              onClick={() => handleTabClick('delete_part')}
            >
              Vymazať súčiastku
            </button>
            <button 
              className={`${styles["menu-button"]} ${activeTab === 'users' ? styles.active : ''}`}
              onClick={() => handleTabClick('users')}
            >
              Používatelia
            </button>
          </div>
        </div>

        <div className={styles["right-content"]}>
          {loading && <div className={styles.loading}>Načítavam...</div>}
          {error && <div className={styles.error}>{error}</div>}

          {activeTab === 'history' && (
            <div className={styles["history-table"]}>
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
                        <td>{usersData[item.user_id] || item.user_id}</td>
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
            <>
              <div className={styles["borrowed-table"]}>
                <table>
                  <thead>
                    <tr>
                      <th>Názov súčiastky</th>
                      <th>Hodnota</th>
                      <th>Počet vypožičaných (ks)</th>
                      <th>Akcia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {borrowedData.map((item) => {
                      const part = partsList.find(p => p.part_id === item.part_id);
                      return (
                        <tr key={item.borrowed_id}>
                          <td>{part ? part.name : `Neznáma súčiastka (ID: ${item.part_id})`}</td>
                          <td>{part ? part.value : 'N/A'}</td>
                          <td>{item.count}</td>
                          <td>
                            <button 
                              onClick={() => handleReturnPart(item.borrowed_id)}
                              className={styles["return-button"]}
                            >
                              Vrátiť
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {borrowedData.length > 0 && (
                <div className={styles["return-all-container"]}>
                  <button 
                    onClick={handleReturnAll}
                    className={styles["return-all-button"]}
                  >
                    Vrátiť všetko ({borrowedData.length})
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === 'add_part' && (
            <div className={styles["form-container"]}>
              <form onSubmit={handleAddPart}>
                <div className={styles["form-group"]}>
                  <label>Kategória:</label>
                  <input
                    type="text"
                    name="category"
                    value={addPartData.category}
                    onChange={handleAddPartChange}
                    required
                  />
                </div>
                <div className={styles["form-group"]}>
                  <label>Podkategória:</label>
                  <input
                    type="text"
                    name="sub_category"
                    value={addPartData.sub_category}
                    onChange={handleAddPartChange}
                  />
                </div>
                <div className={styles["form-group"]}>
                  <label>Názov:</label>
                  <input
                    type="text"
                    name="name"
                    value={addPartData.name}
                    onChange={handleAddPartChange}
                    required
                  />
                </div>
                <div className={styles["form-group"]}>
                  <label>Hodnota:</label>
                  <input
                    type="text"
                    name="value"
                    value={addPartData.value}
                    onChange={handleAddPartChange}
                    required
                  />
                </div>
                <div className={styles["form-group"]}>
                  <label>Počet:</label>
                  <input
                    type="number"
                    name="count"
                    value={addPartData.count}
                    onChange={handleAddPartChange}
                    required
                    min="1"
                  />
                </div>
                <button type="submit" className={styles["submit-button"]}>Pridať súčiastku</button>
              </form>
            </div>
          )}

          {activeTab === 'delete_part' && (
            <div className={styles["form-container"]}>
              <form onSubmit={handleDeletePart}>
                <div className={styles["form-group"]}>
                  <label>Názov súčiastky:</label>
                  <input
                    type="text"
                    name="name"
                    value={deletePartData.name}
                    onChange={handleDeletePartChange}
                    required
                  />
                </div>
                <div className={styles["form-group"]}>
                  <label>Hodnota:</label>
                  <input
                    type="text"
                    name="value"
                    value={deletePartData.value}
                    onChange={handleDeletePartChange}
                    required
                  />
                </div>
                <button type="submit" className={`${styles["submit-button"]} ${styles.delete}`}>Vymazať súčiastku</button>
              </form>
            </div>
          )}

          {activeTab === 'users' && (
            <div className={styles["users-container"]}>
              <div className={styles["users-create"]}>
                <h3>Vytvoriť používateľa</h3>
                <form onSubmit={handleCreateUser}>
                  <div className={styles["form-group"]}>
                    <label>Prihlasovacie meno:</label>
                    <input
                      type="text"
                      name="username"
                      value={newUser.username}
                      onChange={handleNewUserChange}
                      required
                    />
                  </div>
                  <div className={styles["form-group"]}>
                    <label>Heslo:</label>
                    <input
                      type="password"
                      name="password"
                      value={newUser.password}
                      onChange={handleNewUserChange}
                      required
                    />
                  </div>
                  <div className={styles["form-group"]}>
                    <label>Práva:</label>
                    <input
                      type="text"
                      name="rights"
                      value="all"
                      readOnly
                    />
                  </div>
                  <button type="submit" className={styles["submit-button"]}>
                    Vytvoriť používateľa
                  </button>
                </form>
              </div>
              
              <div className={styles["users-delete"]}>
                <h3>Odstrániť používateľa</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Meno</th>
                      <th>Akcia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map(user => (
                      <tr key={user.user_id}>
                        <td>{user.username}</td>
                        <td>
                          <button 
                            onClick={() => handleDeleteUser(user.user_id)}
                            className={styles["delete-button"]}
                          >
                            Odstrániť
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && <div></div>}
        </div>
      </div>
    </>
  );
};

export default Ucet;