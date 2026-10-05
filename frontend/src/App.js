import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Default PW Batches Fallback
const FALLBACK_BATCHES = [
  { _id: '698adaafee5f29171102c9ca', name: 'Yakeen NEET Hindi 2027', category: 'NEET', language: 'Hindi', byName: 'Popular', previewImage: null },
  { _id: 'yakeen_neet_1_2027', name: 'Yakeen NEET 1.0 2027', category: 'NEET', language: 'Hinglish', byName: 'Live', previewImage: null },
  { _id: 'yakeen_neet_2_2027', name: 'Yakeen NEET 2.0 2027', category: 'NEET', language: 'Hinglish', byName: 'Live', previewImage: null },
  { _id: 'arjuna_neet_1_2027', name: 'Arjuna NEET 1.0 2027', category: 'NEET', language: 'Class 11th', byName: 'Class 11', previewImage: null },
  { _id: 'arjuna_neet_hindi_2027', name: 'Arjuna NEET Hindi 2027', category: 'NEET', language: 'Class 11th (Hindi)', byName: 'Class 11', previewImage: null },
  { _id: 'lakshay_neet_1_2027', name: 'Lakshay NEET 1.0 2027', category: 'NEET', language: 'Class 12th', byName: 'Class 12', previewImage: null },
  { _id: 'prayas_jee_1_2027', name: 'Prayas JEE 1.0 2027', category: 'JEE', language: 'Hinglish', byName: 'Live', previewImage: null },
  { _id: 'prayas_jee_hindi_2027', name: 'Prayas JEE Hindi 2027', category: 'JEE', language: 'Hindi', byName: 'Live', previewImage: null },
  { _id: 'arjuna_jee_1_2027', name: 'Arjuna JEE 1.0 2027', category: 'JEE', language: 'Class 11th', byName: 'Class 11', previewImage: null },
  { _id: 'lakshay_jee_1_2027', name: 'Lakshay JEE 1.0 2027', category: 'JEE', language: 'Class 12th', byName: 'Class 12', previewImage: null }
];

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [batches, setBatches] = useState(FALLBACK_BATCHES);
  const [activeBatch, setActiveBatch] = useState(null);
  const [contentType, setContentType] = useState('batch_test');
  const [items, setItems] = useState([]);
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);

  // Read batch ID directly from URL path if deep-linked
  useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    if (pathParts[1] === 'batch' && pathParts[2]) {
      const bId = pathParts[2];
      const bType = pathParts[4] || 'batch_test';
      const decodedName = pathParts[3] ? decodeURIComponent(pathParts[3]) : 'Selected Batch';
      
      const found = batches.find(b => b._id === bId) || { _id: bId, name: decodedName, category: 'NEET' };
      setActiveBatch(found);
      setContentType(bType);
    }
  }, []);

  // Fetch Live Batches from API
  useEffect(() => {
    setLoadingBatches(true);
    axios.get('/api/pw-batches')
      .then(res => {
        if (res.data.success && res.data.batches && res.data.batches.length > 0) {
          setBatches(res.data.batches);
        }
      })
      .catch(err => {
        console.warn("Using local fallback batches catalog.");
      })
      .finally(() => setLoadingBatches(false));
  }, []);

  const handleOpenBatch = (batch, type = 'batch_test') => {
    setActiveBatch(batch);
    setContentType(type);
    const batchId = batch._id || batch.id;
    const batchName = encodeURIComponent(batch.name || 'batch');
    window.history.pushState({}, '', `/batch/${batchId}/${batchName}/${type}`);
  };

  const handleBack = () => {
    setActiveBatch(null);
    window.history.pushState({}, '', '/');
  };

  // Fetch Batch Content (Tests/DPPs)
  useEffect(() => {
    if (activeBatch) {
      setLoadingItems(true);
      const batchId = activeBatch._id || activeBatch.id;
      axios.get(`/api/live/${batchId}/${contentType}`)
        .then(res => {
          if (res.data.success) setItems(res.data.items || []);
        })
        .catch(() => setItems([]))
        .finally(() => setLoadingItems(false));
    }
  }, [activeBatch, contentType]);

  const filteredBatches = batches.filter(b => {
    const name = b.name || '';
    const exam = b.exam || b.category || '';
    const matchesCat = selectedCategory === 'ALL' || exam.toUpperCase().includes(selectedCategory);
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{ backgroundColor: '#070a12', color: '#f1f5f9', minHeight: '100vh', fontFamily: "system-ui, -apple-system, sans-serif" }}>
      
      {/* Top Navbar */}
      <nav style={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={handleBack}>
          <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #0284c7, #9333ea)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '20px' }}>⚡</span>
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', background: 'linear-gradient(to right, #38bdf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              QUIZARD
            </h2>
            <p style={{ margin: 0, fontSize: '10px', color: '#64748b', fontWeight: '600' }}>PW PORTAL LIVE v3.0</p>
          </div>
        </div>
        <span style={{ fontSize: '11px', fontWeight: '700', color: '#38bdf8', backgroundColor: 'rgba(2, 132, 199, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '4px 12px', borderRadius: '20px' }}>
          ● AUTO-SYNC
        </span>
      </nav>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '18px 14px' }}>
        
        {/* HOMEPAGE BATCH CATALOGUE */}
        {!activeBatch ? (
          <div>
            <input 
              type="text" 
              placeholder="🔍 Search batch name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', backgroundColor: '#0f172a', border: '1px solid #1e293b', color: '#fff', fontSize: '14px', boxSizing: 'border-box', outline: 'none', marginBottom: '14px' }}
            />

            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {['ALL', 'NEET', 'JEE'].map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setSelectedCategory(cat)}
                  style={{ flex: 1, padding: '10px', borderRadius: '10px', border: selectedCategory === cat ? '1px solid #38bdf8' : '1px solid #1e293b', fontWeight: '700', cursor: 'pointer', backgroundColor: selectedCategory === cat ? '#0284c7' : '#0f172a', color: '#fff', fontSize: '13px' }}
                >
                  {cat === 'ALL' ? 'All Streams' : cat === 'NEET' ? '🩺 NEET' : '⚙️ JEE'}
                </button>
              ))}
            </div>

            <h3 style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '12px' }}>
              AVAILABLE BATCHES ({filteredBatches.length})
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {filteredBatches.map((batch, index) => (
                <div 
                  key={batch._id || batch.id || index} 
                  onClick={() => handleOpenBatch(batch, 'batch_test')}
                  style={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '14px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '100px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ width: '36px', height: '36px', backgroundColor: '#1e293b', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                      {batch.previewImage ? <img src={batch.previewImage.baseUrl + batch.previewImage.key} alt="" style={{ width: '100%', borderRadius: '6px' }} /> : '🩺'}
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: '700', color: '#38bdf8', backgroundColor: 'rgba(56, 189, 248, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                      {batch.byName || 'PW'}
                    </span>
                  </div>

                  <div style={{ marginTop: '10px' }}>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: '700', color: '#f8fafc', lineHeight: '1.3' }}>
                      {batch.name}
                    </h4>
                    <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>
                      {batch.language || 'Hindi / English'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ) : (
          /* INSIDE BATCH VIEW */
          <div>
            <button 
              onClick={handleBack}
              style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', color: '#38bdf8', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px', marginBottom: '14px' }}
            >
              ← Back to Batches
            </button>

            <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '20px' }}>
              <h2 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: '800', color: '#fff' }}>{activeBatch.name}</h2>
              <p style={{ margin: 0, fontSize: '12px', color: '#a7f3d0' }}>ID: {activeBatch._id || activeBatch.id}</p>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button 
                  onClick={() => handleOpenBatch(activeBatch, 'batch_test')}
                  style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', fontWeight: '700', cursor: 'pointer', backgroundColor: contentType === 'batch_test' ? '#0284c7' : '#0f172a', color: '#fff', fontSize: '13px' }}
                >
                  📝 Mock Tests
                </button>
                <button 
                  onClick={() => handleOpenBatch(activeBatch, 'dpp')}
                  style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', fontWeight: '700', cursor: 'pointer', backgroundColor: contentType === 'dpp' ? '#0284c7' : '#0f172a', color: '#fff', fontSize: '13px' }}
                >
                  📚 Daily DPPs
                </button>
              </div>
            </div>

            {loadingItems ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading tests/DPPs...</div>
            ) : items.length === 0 ? (
              <div style={{ backgroundColor: '#0f172a', border: '1px dashed #334155', borderRadius: '14px', padding: '40px 20px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>No test series / DPP synced for this batch yet.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '10px' }}>
                {items.map((item, idx) => (
                  <div key={idx} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', color: '#f8fafc', fontSize: '14px' }}>{item.title}</h4>
                      <span style={{ fontSize: '11px', color: '#22c55e' }}>{item.totalQuestions || 0} Questions</span>
                    </div>
                    <button style={{ backgroundColor: '#22c55e', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '13px' }}>Start</button>
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
