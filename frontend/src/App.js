import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [batches, setBatches] = useState([]);
  const [activeBatch, setActiveBatch] = useState(null);
  const [contentType, setContentType] = useState('batch_test');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Bulletproof Fetch Live PW Batches
  useEffect(() => {
    setLoading(true);
    axios.get('/api/pw-batches')
      .then(res => {
        const responseData = res.data;
        let batchList = [];

        // Flexible parsing for any JSON format from backend
        if (Array.isArray(responseData)) {
          batchList = responseData;
        } else if (Array.isArray(responseData.batches)) {
          batchList = responseData.batches;
        } else if (Array.isArray(responseData.data)) {
          batchList = responseData.data;
        } else if (responseData.data && Array.isArray(responseData.data.batches)) {
          batchList = responseData.data.batches;
        }

        setBatches(batchList);
      })
      .catch(err => {
        console.error("PW Live Fetch Error:", err);
        setBatches([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleOpenBatch = (batch, type = 'batch_test') => {
    setActiveBatch(batch);
    setContentType(type);
    const batchId = batch._id || batch.id;
    window.history.pushState({}, '', `/batch/${batchId}/${encodeURIComponent(batch.name || batch.batchName)}/${type}`);
  };

  const handleBack = () => {
    setActiveBatch(null);
    window.history.pushState({}, '', '/');
  };

  // Fetch Batch Content
  useEffect(() => {
    if (activeBatch) {
      const batchId = activeBatch._id || activeBatch.id;
      axios.get(`/api/live/${batchId}/${contentType}`)
        .then(res => {
          const itemData = res.data;
          setItems(itemData.items || itemData.data || (Array.isArray(itemData) ? itemData : []));
        })
        .catch(() => setItems([]));
    }
  }, [activeBatch, contentType]);

  const filteredBatches = batches.filter(b => {
    const name = b.name || b.batchName || '';
    const exam = b.exam || b.category || '';
    const matchesCat = selectedCategory === 'ALL' || exam.toUpperCase().includes(selectedCategory);
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{ backgroundColor: '#070a12', color: '#f1f5f9', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* Header */}
      <nav style={{ backgroundColor: '#0f172a', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={handleBack}>
          <span style={{ fontSize: '24px' }}>⚡</span>
          <h2 style={{ margin: 0, fontSize: '18px', color: '#38bdf8' }}>QUIZARD PW LIVE</h2>
        </div>
        <span style={{ fontSize: '11px', color: '#22c55e', backgroundColor: 'rgba(34, 197, 94, 0.1)', padding: '4px 10px', borderRadius: '12px', border: '1px solid #22c55e' }}>
          ● LIVE CONNECTED
        </span>
      </nav>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '18px 14px' }}>
        {!activeBatch ? (
          <div>
            <input 
              type="text" 
              placeholder="🔍 Search live batches..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: '#0f172a', border: '1px solid #1e293b', color: '#fff', marginBottom: '14px', boxSizing: 'border-box' }}
            />

            <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
              {['ALL', 'NEET', 'JEE'].map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setSelectedCategory(cat)}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: selectedCategory === cat ? '#0284c7' : '#0f172a', color: '#fff', fontWeight: '700', cursor: 'pointer' }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {loading ? (
              <p style={{ textAlign: 'center', color: '#94a3b8' }}>Fetching live PW batches...</p>
            ) : filteredBatches.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#f87171' }}>
                <p>No live batches loaded. Please verify your PW_JWT_TOKEN in Heroku Config Vars.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {filteredBatches.map((batch, index) => (
                  <div 
                    key={batch._id || batch.id || index} 
                    onClick={() => handleOpenBatch(batch, 'batch_test')}
                    style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '14px', cursor: 'pointer' }}
                  >
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#f8fafc' }}>{batch.name || batch.batchName}</h4>
                    <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>{batch.language || 'PW Batch'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <button onClick={handleBack} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', color: '#38bdf8', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', marginBottom: '14px' }}>
              ← Back
            </button>
            <h3 style={{ color: '#fff' }}>{activeBatch.name || activeBatch.batchName}</h3>
            {items.length === 0 ? (
              <p style={{ color: '#94a3b8' }}>No items found for this batch.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {items.map((item, idx) => (
                  <div key={item._id || idx} style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '8px', border: '1px solid #1e293b' }}>
                    <p style={{ margin: 0, fontSize: '13px' }}>{item.name || item.title}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
