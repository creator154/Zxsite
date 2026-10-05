import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Full PW Batch Catalog (NEET, JEE, Foundation - 2027 Target)
const BATCHES = [
  // --- NEET ENGLISH / HINGLISH (2027) ---
  { id: 'arjuna_neet_1_2027', name: 'Arjuna NEET 1.0 2027', category: 'NEET', type: 'Class 11th', image: '🧪' },
  { id: 'arjuna_neet_2_2027', name: 'Arjuna NEET 2.0 2027', category: 'NEET', type: 'Class 11th', image: '🧪' },
  { id: 'arjuna_neet_3_2027', name: 'Arjuna NEET 3.0 2027', category: 'NEET', type: 'Class 11th', image: '🧪' },
  { id: 'lakshay_neet_1_2027', name: 'Lakshay NEET 1.0 2027', category: 'NEET', type: 'Class 12th', image: '🧬' },
  { id: 'lakshay_neet_2_2027', name: 'Lakshay NEET 2.0 2027', category: 'NEET', type: 'Class 12th', image: '🧬' },
  { id: 'lakshay_neet_3_2027', name: 'Lakshay NEET 3.0 2027', category: 'NEET', type: 'Class 12th', image: '🧬' },
  { id: 'yakeen_neet_1_2027', name: 'Yakeen NEET 1.0 2027', category: 'NEET', type: 'Dropper', image: '🩺' },
  { id: 'yakeen_neet_2_2027', name: 'Yakeen NEET 2.0 2027', category: 'NEET', type: 'Dropper', image: '🩺' },
  { id: 'yakeen_neet_3_2027', name: 'Yakeen NEET 3.0 2027', category: 'NEET', type: 'Dropper', image: '🩺' },
  { id: 'yakeen_neet_4_2027', name: 'Yakeen NEET 4.0 2027', category: 'NEET', type: 'Dropper', image: '🩺' },

  // --- NEET HINDI MEDIUM (2027) ---
  { id: 'arjuna_neet_hindi_2027', name: 'Arjuna NEET Hindi 2027', category: 'NEET', type: 'Class 11th (Hindi)', image: '🧪' },
  { id: 'lakshay_neet_hindi_2027', name: 'Lakshay NEET Hindi 2027', category: 'NEET', type: 'Class 12th (Hindi)', image: '🧬' },
  { id: 'yakeen_neet_hindi_1_2027', name: 'Yakeen NEET Hindi 1.0 2027', category: 'NEET', type: 'Dropper (Hindi)', image: '🩺' },
  { id: 'yakeen_neet_hindi_2_2027', name: 'Yakeen NEET Hindi 2.0 2027', category: 'NEET', type: 'Dropper (Hindi)', image: '🩺' },

  // --- JEE ENGLISH / HINGLISH (2027) ---
  { id: 'arjuna_jee_1_2027', name: 'Arjuna JEE 1.0 2027', category: 'JEE', type: 'Class 11th', image: '📐' },
  { id: 'arjuna_jee_2_2027', name: 'Arjuna JEE 2.0 2027', category: 'JEE', type: 'Class 11th', image: '📐' },
  { id: 'arjuna_jee_3_2027', name: 'Arjuna JEE 3.0 2027', category: 'JEE', type: 'Class 11th', image: '📐' },
  { id: 'lakshay_jee_1_2027', name: 'Lakshay JEE 1.0 2027', category: 'JEE', type: 'Class 12th', image: '🚀' },
  { id: 'lakshay_jee_2_2027', name: 'Lakshay JEE 2.0 2027', category: 'JEE', type: 'Class 12th', image: '🚀' },
  { id: 'lakshay_jee_3_2027', name: 'Lakshay JEE 3.0 2027', category: 'JEE', type: 'Class 12th', image: '🚀' },
  { id: 'prayas_jee_1_2027', name: 'Prayas JEE 1.0 2027', category: 'JEE', type: 'Dropper', image: '⚙️' },
  { id: 'prayas_jee_2_2027', name: 'Prayas JEE 2.0 2027', category: 'JEE', type: 'Dropper', image: '⚙️' },

  // --- JEE HINDI MEDIUM (2027) ---
  { id: 'arjuna_jee_hindi_2027', name: 'Arjuna JEE Hindi 2027', category: 'JEE', type: 'Class 11th (Hindi)', image: '📐' },
  { id: 'lakshay_jee_hindi_2027', name: 'Lakshay JEE Hindi 2027', category: 'JEE', type: 'Class 12th (Hindi)', image: '🚀' },
  { id: 'prayas_jee_hindi_1_2027', name: 'Prayas JEE Hindi 1.0 2027', category: 'JEE', type: 'Dropper (Hindi)', image: '⚙️' },

  // --- FOUNDATION (2027 Target) ---
  { id: 'udaan_class_10_2027', name: 'Udaan Class 10th 2027', category: 'FOUNDATION', type: 'Class 10th', image: '📚' },
  { id: 'neev_class_9_2027', name: 'Neev Class 9th 2027', category: 'FOUNDATION', type: 'Class 9th', image: '📖' }
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
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.type.toLowerCase().includes(searchQuery.toLowerCase());
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
      
      {/* Top Header */}
      <nav style={{ backgroundColor: '#111827', borderBottom: '1px solid #1f2937', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>⚡</span>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#38bdf8' }}>
            QUIZARD <span style={{ fontSize: '12px', color: '#a855f7', backgroundColor: '#2e1065', padding: '2px 8px', borderRadius: '12px' }}>v3.0</span>
          </h2>
        </div>
        <span style={{ fontSize: '12px', color: '#94a3b8', backgroundColor: '#1e293b', padding: '5px 12px', borderRadius: '20px' }}>PW 2027 Test Engine</span>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px 15px' }}>
        
        {!selectedBatch ? (
          <div>
            {/* Search and Category Filter */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <input 
                type="text" 
                placeholder="🔍 Search batch (e.g. Yakeen 2027, Prayas, Arjuna)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '14px', borderRadius: '10px', backgroundColor: '#111827', border: '1px solid #374151', color: '#fff', fontSize: '15px', boxSizing: 'border-box', outline: 'none' }}
              />

              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                {['ALL', 'NEET', 'JEE', 'FOUNDATION'].map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setSelectedCategory(cat)}
                    style={{ flex: 1, minWidth: '80px', padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', backgroundColor: selectedCategory === cat ? '#0284c7' : '#1f2937', color: '#fff' }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Batch Cards Grid */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '16px', color: '#94a3b8', margin: 0 }}>AVAILABLE 2027 BATCHES</h3>
              <span style={{ fontSize: '12px', color: '#38bdf8' }}>{filteredBatches.length} Batches Found</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
              {filteredBatches.map(batch => (
                <div 
                  key={batch.id} 
                  onClick={() => setSelectedBatch(batch)}
                  style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px' }}
                >
                  <div style={{ fontSize: '28px', backgroundColor: '#1e293b', padding: '10px', borderRadius: '10px' }}>{batch.image}</div>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', color: '#f8fafc' }}>{batch.name}</h4>
                    <span style={{ fontSize: '11px', color: '#38bdf8', backgroundColor: '#0369a1', padding: '2px 8px', borderRadius: '4px' }}>{batch.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Tests & DPP View */
          <div>
            <button 
              onClick={() => setSelectedBatch(null)}
              style={{ backgroundColor: '#1f2937', color: '#38bdf8', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '20px' }}
            >
              ← Back to Batches
            </button>

            <div style={{ backgroundColor: '#111827', padding: '20px', borderRadius: '12px', border: '1px solid #1f2937', marginBottom: '20px' }}>
              <h2 style={{ margin: '0 0 6px 0', color: '#f8fafc' }}>{selectedBatch.name}</h2>
              <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>Category: {selectedBatch.category} | {selectedBatch.type}</p>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button 
                  onClick={() => setContentType('test')}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', backgroundColor: contentType === 'test' ? '#0284c7' : '#1f2937', color: '#fff' }}
                >
                  📝 Mock Tests
                </button>
                <button 
                  onClick={() => setContentType('dpp')}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', backgroundColor: contentType === 'dpp' ? '#0284c7' : '#1f2937', color: '#fff' }}
                >
                  📚 Daily DPPs
                </button>
              </div>
            </div>

            {loading ? (
              <p style={{ textAlign: 'center', color: '#94a3b8' }}>Loading content...</p>
            ) : items.length === 0 ? (
              <div style={{ backgroundColor: '#111827', textAlign: 'center', padding: '40px 20px', borderRadius: '12px', border: '1px solid #1f2937' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#f8fafc' }}>No {contentType.toUpperCase()}s Synced Yet</h3>
                <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Selected 2027 batch ke items admin panel se sync hote hi yahan auto-update honge.</p>
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
                      Start Test
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
