import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [batchId, setBatchId] = useState('yakeen_2027');
  const [activeTab, setActiveTab] = useState('test'); // 'test' or 'dpp'
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(null);

  // Fetch Live Content from Heroku Backend
  const fetchLiveContent = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/live/${batchId}/${activeTab}`);
      if (res.data.success) {
        setItems(res.data.items);
      }
    } catch (err) {
      console.error('Error fetching live content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveContent();
  }, [batchId, activeTab]);

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', padding: '15px' }}>
      {/* Top Banner / Navbar */}
      <header style={{ backgroundColor: '#1e293b', color: '#fff', padding: '16px 20px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '700' }}>🎓 Student Test & DPP Portal</h1>
        <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#94a3b8' }}>Real-time Live Practice Engine</p>
      </header>

      {/* Batch & Type Control Bar */}
      <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label style={{ fontSize: '14px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>Select Batch ID:</label>
          <input 
            type="text" 
            value={batchId} 
            onChange={(e) => setBatchId(e.target.value)} 
            placeholder="e.g. yakeen_2027"
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
          />
        </div>

        {/* Tab Switcher (Tests vs DPPs) */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
          <button 
            onClick={() => setActiveTab('test')}
            style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer', backgroundColor: activeTab === 'test' ? '#2563eb' : '#f1f5f9', color: activeTab === 'test' ? '#fff' : '#475569' }}
          >
            📋 Mock Tests
          </button>
          <button 
            onClick={() => setActiveTab('dpp')}
            style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer', backgroundColor: activeTab === 'dpp' ? '#2563eb' : '#f1f5f9', color: activeTab === 'dpp' ? '#fff' : '#475569' }}
          >
            ✏️ Daily DPPs
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
            <p style={{ fontSize: '16px', fontWeight: '500' }}>Loading content...</p>
          </div>
        ) : items.length === 0 ? (
          <div style={{ backgroundColor: '#fff', textAlign: 'center', padding: '40px 20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <p style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: '0 0 8px 0' }}>No {activeTab.toUpperCase()}s Available</p>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Is batch ID par abhi koi content publish nahi hua hai.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {items.map((item) => (
              <div key={item._id || item.id} style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#0f172a' }}>{item.title}</h3>
                  <span style={{ fontSize: '12px', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '3px 8px', borderRadius: '6px', fontWeight: '500' }}>
                    {item.totalQuestions || 0} Questions
                  </span>
                </div>
                <button 
                  onClick={() => setActiveQuiz(item)}
                  style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}
                >
                  Start
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Active Quiz View Modal / Interface Placeholder */}
        {activeQuiz && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', maxWidth: '500px', width: '100%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
              <h2 style={{ margin: '0 0 12px 0', fontSize: '20px' }}>{activeQuiz.title}</h2>
              <p style={{ color: '#64748b', fontSize: '14px' }}>Questions: {activeQuiz.totalQuestions}</p>
              <p style={{ fontSize: '14px', color: '#334155' }}>Test Engine Mode Loaded Successfully!</p>
              <button 
                onClick={() => setActiveQuiz(null)}
                style={{ marginTop: '16px', backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', width: '100%', fontWeight: '600' }}
              >
                Close Test
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
