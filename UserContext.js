// src/context/UserContext.js
import { createContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [scanHistory, setScanHistory] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      const uid = user.id || user.user_id;

      // Fetch Scans
      fetch(`http://127.0.0.1:5000/api/user/${uid}/scans`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const mappedScans = data.map(s => ({
              id: s.scan_id || s.id,
              plant: s.plant_name || s.plant || 'Unknown',
              disease: s.disease_name || s.disease || 'Unknown',
              date: s.date ? new Date(s.date).toLocaleDateString() : '',
              confidence: parseFloat(s.confidence || 0),
              image: s.image_url
            }));
            setScanHistory(mappedScans);
          }
        })
        .catch(err => console.error("Error fetching scans", err));
        
      // Fetch Orders
      fetch(`http://127.0.0.1:5000/api/user/${uid}/orders`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const mappedOrders = data.map(o => ({
              id: o.order_id || o.id,
              date: o.date ? new Date(o.date).toLocaleDateString() : '',
              buyer: o.fullName || o.buyer || 'Guest',
              total: parseFloat(o.total || 0),
              items: o.items || []
            }));
            setOrderHistory(mappedOrders);
          }
        })
        .catch(err => console.error("Error fetching orders", err));

    } else {
      localStorage.removeItem('user');
      setScanHistory([]);
      setOrderHistory([]);
    }
  }, [user]);

  const addScan = (scan) => {
    setScanHistory(prev => [scan, ...prev]);
  };

  const addOrder = (order) => {
    setOrderHistory(prev => [order, ...prev]);
  };

  const logout = () => {
    setUser(null);
    // Optionally clear histories if you want per‑user; otherwise keep.
  };

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      scanHistory,
      orderHistory,
      addScan,
      addOrder,
      logout,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;