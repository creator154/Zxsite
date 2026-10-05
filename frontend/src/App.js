import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [batchId, setBatchId] = useState('yakeen_2027');
  const [type, setType] = useState('test');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLiveContent = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/live/${batchId}/${type}`);
      if (res.data.success) {
        setItems(res.data.items);
      }
    } catch (err) {
      console.error("Content fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveContent();
  }, [batchId, type]);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh', padding: '20px' }}>
      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '30px', backgroundColor: '#007bff', color: '#fff', padding: '20px', borderRadius: '8px' }}>
        <h1 style={{ margin: 0 }}>PW Student Portal</h1>
        <p style={{ margin: '5px 0 0 0' }}>Practice Live Tests & Daily Practice Papers (DPPs)</p>
      </header>

      {/* Filter Controls */}
      <div style={{ maxWidth: '800px', margin: '0 auto 20px auto', display: 'flex', gap: '15px', justifyContent: 'center', backgroundColor: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div>
          <label style={{ fontWeight: 'bold', marginRight: '8px' }}>Batch ID:</label>
          <input 
            type="text" 
            value={batchId} 
            onChange={(e) => setBatchId(e.target.value)} 
            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div>
          <label style={{ fontWeight: 'bold', marginRight: '8px' }}>Type:</label>
          <select value={type} onChange={(e) => setType(e.target.value)} style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}>
            <option value="test">Tests</option>
            <option value="dpp">DPPs</option>
          </select>
        </div>
      </div>

      {/* Content Display */}
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {loading ? (
          <p style={{ textAlign: 'center', fontSize: '18px' }}>Loading content...</p>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', backgroundColor: '#fff', padding: '40px', borderRadius: '8px' }}>
            <h3>No {type.toUpperCase()}s Available Yet</h3>
            <p style={{ color: '#666' }}>Is batch ke liye abhi koi content sync nahi hua hai.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '15px' }}>
            {items.map((item, index) => (
              <div key={index} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>{item.title}</h3>
                  <span style={{ fontSize: '14px', color: '#666', backgroundColor: '#e9ecef', padding: '4px 8px', borderRadius: '4px' }}>
                    Questions: {item.totalQuestions || 0}
                  </span>
                </div>
                <button 
                  onClick={() => alert(`Starting ${item.title}`)}
                  style={{ backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Start {type === 'test' ? 'Test' : 'Practice'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
