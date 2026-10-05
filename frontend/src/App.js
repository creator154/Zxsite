import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Quizard V3 Batch List Database
const BATCHES = [
  // NEET Batches
  { id: 'yakeen_neet_1', name: 'Yakeen NEET 1.0', category: 'NEET', type: 'Dropper', image: '🩺' },
  { id: 'yakeen_neet_2', name: 'Yakeen NEET 2.0', category: 'NEET', type: 'Dropper', image: '🩺' },
  { id: 'yakeen_neet_hindi', name: 'Yakeen NEET Hindi', category: 'NEET', type: 'Dropper (Hindi)', image: '🩺' },
  { id: 'arjuna_neet_1', name: 'Arjuna NEET 1.0', category: 'NEET', type: 'Class 11th', image: '🧪' },
  { id: 'lakshay_neet_1', name: 'Lakshay NEET 1.0', category: 'NEET', type: 'Class 12th', image: '🧬' },
  
  // JEE Batches
  { id: 'prayas_jee_1', name: 'Prayas JEE 1.0', category: 'JEE', type: 'Dropper', image: '⚙️' },
  { id: 'prayas_jee_hindi', name: 'Prayas JEE Hindi', category: 'JEE', type: 'Dropper (Hindi)', image: '⚙️' },
  { id: 'arjuna_jee_1', name: 'Arjuna JEE 1.0', category: 'JEE', type: 'Class 11th', image: '📐' },
  { id: 'lakshay_jee_1', name: 'Lakshay JEE 1.0', category: 'JEE', type: 'Class 12th', image: '🚀' }
];

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [contentType, setContentType] = useState('test');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const filteredBatches = BATCHES.filter(b => {
    const matchesCat = selectedCategory === 'ALL' || b.category === selectedCategory;
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  useEffect(() => {
    if (selectedBatch) {
      setLoading(true);
      axios.get(`/api/live/${selectedBatch.id}/${contentType}`)
        .then(res => {
          if (res.data.success) setItems(res.data.items);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [selectedBatch, contentType]);

  return (
    <div style={{ backgroundColor: '#0b0f19', color: '#e2e8f0', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Top Navbar */}
      <nav style={{ backgroundColor: '#111827', borderBottom: '1px solid #1f2937', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>⚡</span>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#38bdf8' }}>
            QUIZARD <span style={{ fontSize: '12px', color: '#a855f7', backgroundColor: '#2e1065', padding: '2px 8px', borderRadius: '12px' }}>v3.0</span>
          </h2>
        </div>
        <span style={{ fontSize: '13px', color: '#94a3b8', backgroundColor: '#1e293b', padding: '5px 12px', borderRadius: '20px' }}>PW Live Test Engine</span>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px 15px' }}>
        
        {!selectedBatch ? (
          <div>
            {/* Search & Stream Filter */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <input 
                type="text" 
                placeholder="Search PW Batch (Yakeen, Prayas, Arjuna)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '14px', borderRadius: '10px', backgroundColor: '#111827', border: '1px solid #374151', color: '#fff', fontSize: '15px', boxSizing: 'border-box', outline: 'none' }}
              />

              <div style={{ display: 'flex', gap: '10px' }}>
                {['ALL', 'NEET', 'JEE'].map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setSelectedCategory(cat)}
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', backgroundColor: selectedCategory === cat ? '#0284c7' : '#1f2937', color: '#fff' }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Batch Cards Grid */}
            <h3 style={{ fontSize: '16px', color: '#94a3b8', marginBottom: '14px' }}>SELECT BATCH</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {filteredBatches.map(batch => (
                <div 
                  key={batch.id} 
                  onClick={() => setSelectedBatch(batch)}
                  style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px' }}
                >
                  <div style={{ fontSize: '32px', backgroundColor: '#1e293b', padding: '10px', borderRadius: '10px' }}>{batch.image}</div>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#f8fafc' }}>{batch.name}</h4>
                    <span style={{ fontSize: '12px', color: '#38bdf8', backgroundColor: '#0369a1', padding: '2px 8px', borderRadius: '4px' }}>{batch.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Tests/DPPs List */
          <div>
            <button 
              onClick={() => setSelectedBatch(null)}
              style={{ backgroundColor: '#1f2937', color: '#38bdf8', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '20px' }}
            >
              Back to Batches
            </button>

            <div style={{ backgroundColor: '#111827', padding: '20px', borderRadius: '12px', border: '1px solid #1f2937', marginBottom: '20px' }}>
              <h2 style={{ margin: '0 0 6px 0', color: '#f8fafc' }}>{selectedBatch.name}</h2>
              <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>Category: {selectedBatch.category} | {selectedBatch.type}</p>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button 
                  onClick={() => setContentType('test')}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', backgroundColor: contentType === 'test' ? '#0284c7' : '#1f2937', color: '#fff' }}
                >
                  Mock Tests
                </button>
                <button 
                  onClick={() => setContentType('dpp')}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', backgroundColor: contentType === 'dpp' ? '#0284c7' : '#1f2937', color: '#fff' }}
                >
                  Daily DPPs
                </button>
              </div>
            </div>

            {loading ? (
              <p style={{ textAlign: 'center', color: '#94a3b8' }}>Loading content...</p>
            ) : items.length === 0 ? (
              <div style={{ backgroundColor: '#111827', textAlign: 'center', padding: '40px 20px', borderRadius: '12px', border: '1px solid #1f2937' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#f8fafc' }}>No {contentType.toUpperCase()}s Synced Yet</h3>
                <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Selected batch ke items database me sync hone par yahan dikhenge.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '12px' }}>
                {items.map((item, idx) => (
                  <div key={idx} style={{ backgroundColor: '#111827', padding: '16px', borderRadius: '10px', border: '1px solid #1f2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0 0 6px 0', color: '#f8fafc' }}>{item.title}</h4>
                      <span style={{ fontSize: '12px', color: '#22c55e', backgroundColor: '#15803d', padding: '2px 8px', borderRadius: '4px' }}>
                        {item.totalQuestions || 0} Questions
                      </span>
                    </div>
                    <button style={{ backgroundColor: '#22c55e', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                      Start
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
