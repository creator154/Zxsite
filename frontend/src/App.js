import React, { useState, useEffect } from 'react';
import axios from 'axios';

// PW Batch Master List
const BATCH_CATEGORIES = {
  'NEET (English Medium)': [
    { name: 'Arjuna NEET 1.0 (Class 11th)', id: 'arjuna_neet_1' },
    { name: 'Arjuna NEET 2.0 (Class 11th)', id: 'arjuna_neet_2' },
    { name: 'Lakshay NEET 1.0 (Class 12th)', id: 'lakshay_neet_1' },
    { name: 'Lakshay NEET 2.0 (Class 12th)', id: 'lakshay_neet_2' },
    { name: 'Yakeen NEET 1.0 (Dropper)', id: 'yakeen_neet_1' },
    { name: 'Yakeen NEET 2.0 (Dropper)', id: 'yakeen_neet_2' },
    { name: 'Yakeen NEET 3.0 (Dropper)', id: 'yakeen_neet_3' }
  ],
  'NEET (Hindi Medium)': [
    { name: 'Arjuna NEET Hindi (Class 11th)', id: 'arjuna_neet_hindi' },
    { name: 'Lakshay NEET Hindi (Class 12th)', id: 'lakshay_neet_hindi' },
    { name: 'Yakeen NEET Hindi (Dropper)', id: 'yakeen_neet_hindi' }
  ],
  'JEE (English Medium)': [
    { name: 'Arjuna JEE 1.0 (Class 11th)', id: 'arjuna_jee_1' },
    { name: 'Arjuna JEE 2.0 (Class 11th)', id: 'arjuna_jee_2' },
    { name: 'Lakshay JEE 1.0 (Class 12th)', id: 'lakshay_jee_1' },
    { name: 'Lakshay JEE 2.0 (Class 12th)', id: 'lakshay_jee_2' },
    { name: 'Prayas JEE 1.0 (Dropper)', id: 'prayas_jee_1' },
    { name: 'Prayas JEE 2.0 (Dropper)', id: 'prayas_jee_2' }
  ],
  'JEE (Hindi Medium)': [
    { name: 'Arjuna JEE Hindi (Class 11th)', id: 'arjuna_jee_hindi' },
    { name: 'Lakshay JEE Hindi (Class 12th)', id: 'lakshay_jee_hindi' },
    { name: 'Prayas JEE Hindi (Dropper)', id: 'prayas_jee_hindi' }
  ]
};

function App() {
  const [selectedCategory, setSelectedCategory] = useState('NEET (English Medium)');
  const [selectedBatch, setSelectedBatch] = useState(BATCH_CATEGORIES['NEET (English Medium)'][0].id);
  const [activeTab, setActiveTab] = useState('test'); // 'test' or 'dpp'
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(null);

  // Fetch Live Content from Backend
  const fetchLiveContent = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/live/${selectedBatch}/${activeTab}`);
      if (res.data.success) {
        setItems(res.data.items);
      }
    } catch (err) {
      console.error('Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveContent();
  }, [selectedBatch, activeTab]);

  return (
    <div style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', padding: '12px' }}>
      
      {/* Quizard Header Banner */}
      <header style={{ backgroundColor: '#1e293b', border: '1px solid #334155', padding: '16px', borderRadius: '12px', marginBottom: '16px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
        <h1 style={{ margin: 0, fontSize: '22px', color: '#38bdf8', letterSpacing: '0.5px' }}>⚡ QUIZARD - PW TEST PORTAL</h1>
        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>Practice Tests & DPPs for NEET / JEE (Hindi & Eng)</p>
      </header>

      {/* Category Selector */}
      <div style={{ backgroundColor: '#1e293b', padding: '14px', borderRadius: '12px', border: '1px solid #334155', marginBottom: '16px' }}>
        
        <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
          SELECT STREAM / MEDIUM:
        </label>
        <select 
          value={selectedCategory} 
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedBatch(BATCH_CATEGORIES[e.target.value][0].id);
          }}
          style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', color: '#fff', border: '1px solid #475569', borderRadius: '8px', fontSize: '14px', marginBottom: '12px' }}
        >
          {Object.keys(BATCH_CATEGORIES).map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <label style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>
          SELECT TARGET BATCH:
        </label>
        <select 
          value={selectedBatch} 
          onChange={(e) => setSelectedBatch(e.target.value)}
          style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', color: '#38bdf8', border: '1px solid #0284c7', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold' }}
        >
          {BATCH_CATEGORIES[selectedCategory].map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
          <button 
            onClick={() => setActiveTab('test')}
            style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', backgroundColor: activeTab === 'test' ? '#0284c7' : '#334155', color: '#fff' }}
          >
            📝 Mock Tests
          </button>
          <button 
            onClick={() => setActiveTab('dpp')}
            style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', backgroundColor: activeTab === 'dpp' ? '#0284c7' : '#334155', color: '#fff' }}
          >
            📚 Daily DPPs
          </button>
        </div>
      </div>

      {/* Content Area */}
      <main>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: '30px' }}>Syncing content from database...</p>
        ) : items.length === 0 ? (
          <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', textAlign: 'center', padding: '30px 15px', borderRadius: '12px' }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#f8fafc' }}>No {activeTab.toUpperCase()}s Synced Yet</h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Selected batch ke test/dpp content ko admin panel se sync karein.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {items.map((item, idx) => (
              <div key={idx} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', padding: '14px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', color: '#f8fafc', fontSize: '15px' }}>{item.title}</h4>
                  <span style={{ fontSize: '11px', backgroundColor: '#0369a1', color: '#e0f2fe', padding: '2px 6px', borderRadius: '4px' }}>
                    {item.totalQuestions || 0} Questions
                  </span>
                </div>
                <button 
                  onClick={() => setActiveQuiz(item)}
                  style={{ backgroundColor: '#22c55e', color: '#000', border: 'none', padding: '8px 14px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Start
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Modal Window for Quiz Start */}
        {activeQuiz && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '15px' }}>
            <div style={{ backgroundColor: '#1e293b', border: '1px solid #0284c7', padding: '20px', borderRadius: '12px', maxWidth: '450px', width: '100%' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#38bdf8' }}>{activeQuiz.title}</h3>
              <p style={{ fontSize: '14px', color: '#cbd5e1' }}>Total Questions: {activeQuiz.totalQuestions}</p>
              <button 
                onClick={() => setActiveQuiz(null)}
                style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', width: '100%',
