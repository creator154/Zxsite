import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Quizard V3 Style Batch Database Matrix
const BATCHES = [
  // NEET Batches
  { id: 'yakeen_neet_2025', name: 'Yakeen NEET 2025', category: 'NEET', type: 'Dropper', image: '🩺' },
  { id: 'yakeen_neet_hindi_2025', name: 'Yakeen NEET Hindi 2025', category: 'NEET', type: 'Dropper (Hindi)', image: '🩺' },
  { id: 'arjuna_neet_2025', name: 'Arjuna NEET 2025', category: 'NEET', type: 'Class 11th', image: '🧪' },
  { id: 'lakshay_neet_2025', name: 'Lakshay NEET 2025', category: 'NEET', type: 'Class 12th', image: '🧬' },
  
  // JEE Batches
  { id: 'prayas_jee_2025', name: 'Prayas JEE 2025', category: 'JEE', type: 'Dropper', image: '⚙️' },
  { id: 'prayas_jee_hindi_2025', name: 'Prayas JEE Hindi 2025', category: 'JEE', type: 'Dropper (Hindi)', image: '⚙️' },
  { id: 'arjuna_jee_2025', name: 'Arjuna JEE 2025', category: 'JEE', type: 'Class 11th', image: '📐' },
  { id: 'lakshay_jee_2025', name: 'Lakshay JEE 2025', category: 'JEE', type: 'Class 12th', image: '🚀' }
];

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [contentType, setContentType] = useState('test'); // 'test' or 'dpp'
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter batches based on category and search
  const filteredBatches = BATCHES.filter(b => {
    const matchesCat = selectedCategory === 'ALL' || b.category === selectedCategory;
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Fetch tests or DPPs when batch selected
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
    <div style={{ backgroundColor: '#0b0f19', color: '#e2e8f0', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Quizard Top Header */}
      <nav style={{ backgroundColor: '#111827', borderBottom: '1px solid #1f2937', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>⚡</span>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#38bdf8' }}>QUIZARD <span style={{ fontSize: '12px', color: '#a855f7', backgroundColor: '#2e1065', padding: '2px 8px', borderRadius: '12px' }}>v3.0</span></h2>
        </div>
        <span style={{ fontSize: '13px', color: '#94a3b8', backgroundColor: '#1e293b', padding: '5px 12px', borderRadius: '20px' }}>PW Live Test Engine</span>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px 15px' }}>
        
        {/* If No Batch Selected -> Show Quizard Batch Grid */}
        {!selectedBatch ? (
          <div>
            {/* Search and Category Filter Bar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <input 
                type="text" 
                placeholder="🔍 Search PW Batch (e.g. Yakeen, Prayas, Arjuna)..." 
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
            <h3 style={{ fontSize: '16px', color: '#94a3b8', marginBottom: '14px' }}>SELECT YOUR BATCH</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {filteredBatches.map(batch => (
                <div 
                  key={batch.id} 
                  onClick={() => setSelectedBatch(batch)}
                  style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '16px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '15px' }}
                >
                  <div style={{ fontSize: '32px', backgroundColor: '#1e293b', padding: '10px', borderRadius: '10px' }}>{batch.image}</div>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#f8fafc' }}>{batch.name}</h4>
                    <span style={{ fontSize: '12px', color: '#38bdf8', backgroundColor: '#0369a122', padding: '2px 8px', borderRadius: '4px' }}>{batch.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Inside Selected Batch -> Show Tests & DPPs */
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

              {/* Tabs for Test / DPP */}
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
                  ✏️ Daily DPPs
                </button>
              </div>
            </div>

            {/* Content List */}
            {loading ? (
              <p style={{ textAlign: 'center', color: '#94a3b8' }}>Loading content...</p>
            ) : items.length === 0 ? (
              <div style={{ backgroundColor: '#111827', textAlign: 'center', padding: '40px 20px', borderRadius: '12px', border: '1px solid #1f2937
