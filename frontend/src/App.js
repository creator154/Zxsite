import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Full PW Batch Database Matrix (2027 Target)
const BATCHES = [
  // NEET Batches
  { id: '698adaafee5f29171102c9ca', name: 'Yakeen NEET Hindi 2027', category: 'NEET', type: 'Dropper (Hindi)', image: '🩺' },
  { id: 'yakeen_neet_1_2027', name: 'Yakeen NEET 1.0 2027', category: 'NEET', type: 'Dropper', image: '🩺' },
  { id: 'yakeen_neet_2_2027', name: 'Yakeen NEET 2.0 2027', category: 'NEET', type: 'Dropper', image: '🩺' },
  { id: 'arjuna_neet_1_2027', name: 'Arjuna NEET 1.0 2027', category: 'NEET', type: 'Class 11th', image: '🧪' },
  { id: 'arjuna_neet_hindi_2027', name: 'Arjuna NEET Hindi 2027', category: 'NEET', type: 'Class 11th (Hindi)', image: '🧪' },
  { id: 'lakshay_neet_1_2027', name: 'Lakshay NEET 1.0 2027', category: 'NEET', type: 'Class 12th', image: '🧬' },
  
  // JEE Batches
  { id: 'prayas_jee_1_2027', name: 'Prayas JEE 1.0 2027', category: 'JEE', type: 'Dropper', image: '⚙️' },
  { id: 'prayas_jee_hindi_2027', name: 'Prayas JEE Hindi 2027', category: 'JEE', type: 'Dropper (Hindi)', image: '⚙️' },
  { id: 'arjuna_jee_1_2027', name: 'Arjuna JEE 1.0 2027', category: 'JEE', type: 'Class 11th', image: '📐' },
  { id: 'lakshay_jee_1_2027', name: 'Lakshay JEE 1.0 2027', category: 'JEE', type: 'Class 12th', image: '🚀' }
];

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeBatch, setActiveBatch] = useState(null);
  const [contentType, setContentType] = useState('batch_test'); // 'batch_test' or 'dpp'
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sync state with URL hash/pathname for deep-linking simulation
  const handleOpenBatch = (batch, type = 'batch_test') => {
    setActiveBatch(batch);
    setContentType(type);
    const encodedName = encodeURIComponent(batch.name);
    window.history.pushState({}, '', `/batch/${batch.id}/${encodedName}/${type}`);
  };

  const handleBack = () => {
    setActiveBatch(null);
    window.history.pushState({}, '', '/');
  };

  // Fetch batch items when inside a batch URL
  useEffect(() => {
    if (activeBatch) {
      setLoading(true);
      axios.get(`/api/live/${activeBatch.id}/${contentType}`)
        .then(res => {
          if (res.data.success) setItems(res.data.items);
        })
        .catch(() => setItems([]))
        .finally(() => setLoading(false));
    }
  }, [activeBatch, contentType]);

  const filteredBatches = BATCHES.filter(b => {
    const matchesCat = selectedCategory === 'ALL' || b.category === selectedCategory;
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{ backgroundColor: '#090d16', color: '#e2e8f0', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Header */}
      <nav style={{ backgroundColor: '#0f172a', borderBottom: '1px solid #1e293b', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={handleBack}>
          <span style={{ fontSize: '22px' }}>⚡</span>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#38bdf8' }}>
            QUIZARD <span style={{ fontSize: '11px', color: '#c084fc', backgroundColor: '#3b0764', padding: '2px 8px', borderRadius: '10px' }}>v3.0</span>
          </h2>
        </div>
        <span style={{ fontSize: '12px', color: '#94a3b8', backgroundColor: '#1e293b', padding: '4px 10px', borderRadius: '16px' }}>PW Portal Live</span>
      </nav>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '16px' }}>
        
        {/* VIEW 1: BATCHES CATALOG GRID */}
        {!activeBatch ? (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <input 
                type="text" 
                placeholder="🔍 Search batch name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
              />

              <div style={{ display: 'flex', gap: '8px' }}>
                {['ALL', 'NEET', 'JEE'].map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setSelectedCategory(cat)}
                    style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer', backgroundColor: selectedCategory === cat ? '#0284c7' : '#1e293b', color: '#fff', fontSize: '13px' }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <h3 style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>AVAILABLE BATCHES</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
              {filteredBatches.map(batch => (
                <div 
                  key={batch.id} 
                  onClick={() => handleOpenBatch(batch, 'batch_test')}
                  style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', padding: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
                >
                  <div style={{ fontSize: '26px', backgroundColor: '#1e293b', padding: '8px', borderRadius: '8px' }}>{batch.image}</div>
                  <div>
                    <h4 style={{ margin: '0 0 2px 0', fontSize: '15px', color: '#f8fafc' }}>{batch.name}</h4>
                    <span style={{ fontSize: '11px', color: '#38bdf8', backgroundColor: '#0284c722', padding: '2px 6px', borderRadius: '4px' }}>{batch.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* VIEW 2: INSIDE BATCH (QUIZARD V3 EXACT INTERNAL PAGE) */
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <button 
                onClick={handleBack}
                style={{ backgroundColor: '#1e293b', color: '#38bdf8', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
              >
                ← Back
              </button>
              <span style={{ fontSize: '12px', color: '#64748b' }}>/ batch / {activeBatch.id}</span>
            </div>

            {/* Batch Header Bar */}
            <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '10px', border: '1px solid #1e293b', marginBottom: '16px' }}>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#f8fafc' }}>{activeBatch.name}</h2>
              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>ID: {activeBatch.id} | Stream: {activeBatch.category}</p>

              {/* Sub-Tabs: Tests vs DPPs */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                <button 
                  onClick={() => handleOpenBatch(activeBatch, 'batch_test')}
                  style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer', backgroundColor: contentType === 'batch_test' ? '#0284c7' : '#1e293b', color: '#fff', fontSize: '13px' }}
                >
                  📝 Batch Tests
                </button>
                <button 
                  onClick={() => handleOpenBatch(activeBatch, 'dpp')}
                  style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer', backgroundColor: contentType === 'dpp' ? '#0284c7' : '#1e293b', color: '#fff', fontSize: '13px' }}
                >
                  📚 Daily DPPs
                </button>
              </div>
            </div>

            {/* Content List / State */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
                <p>Fetching test series data from backend...</p>
              </div>
            ) : items.length === 0 ? (
              <div style={{ backgroundColor: '#0f172a', border: '1px dashed #334155', borderRadius: '10px', padding: '36px 16px', textAlign: 'center' }}>
                <h3 style={{ margin: '0 0 6px 0', color: '#f8fafc', fontSize: '16px' }}>No Tests Synced for this Batch</h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                  Admin panel se batch token/ID sync hotey hi saare tests auto-update ho jayenge.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '10px' }}>
                {items.map((item, idx) => (
                  <div key={idx} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', color: '#f8fafc', fontSize: '14px' }}>{item.title}</h4>
                      <span style={{ fontSize: '11px', color: '#22c55e', backgroundColor: '#15803d22', padding: '2px 6px', borderRadius: '4px' }}>
                        {item.totalQuestions || 0} Questions
                      </span>
                    </div>
                    <button style={{ backgroundColor: '#22c55e', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
                      Attempt
                    </button>
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
