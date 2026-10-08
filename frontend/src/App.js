import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API = '';

function App() {
  const [batches, setBatches] = useState([]);
  const [activeBatch, setActiveBatch] = useState(null);
  const [contentType, setContentType] = useState('batch_test');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');

  const [activeTest, setActiveTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [testError, setTestError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const getId = (item) =>
    String(item?._id || item?.id || item?.batchId || item?.sourceBatchId || item?.sourceTestId || '');

  const getName = (item) =>
    item?.name || item?.title || item?.batchName || item?.testName || 'Untitled';

  const extractList = (data) => {
    if (Array.isArray(data)) return data;

    for (const key of ['items', 'batches', 'tests', 'dpps', 'questions']) {
      if (Array.isArray(data?.[key])) return data[key];
    }

    for (const key of ['items', 'batches', 'tests', 'dpps', 'questions', 'data']) {
      if (Array.isArray(data?.data?.[key])) return data.data[key];
    }

    if (Array.isArray(data?.data)) return data.data;

    return [];
  };

  const questionListFrom = (data) => {
    const candidates = [
      data?.questions,
      data?.questionList,
      data?.question_list,
      data?.data?.questions,
      data?.data?.questionList,
      data?.test?.questions,
      data?.data?.test?.questions,
      data?.result?.questions
    ];

    return candidates.find(Array.isArray) || [];
  };

  const loadBatches = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const res = await axios.get(`${API}/api/pw-batches`);
      setBatches(extractList(res.data));
    } catch (e) {
      setError('Batches load nahi ho paaye. Server check karo.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBatches();
  }, [loadBatches]);

  const openBatch = (batch, type = 'batch_test') => {
    setActiveBatch(batch);
    setContentType(type);
    setActiveTest(null);
    setTestError('');
    setSubmitted(false);
    setItems([]);

    const id = getId(batch);
    const name = encodeURIComponent(getName(batch));
    const urlType = type === 'dpp' ? 'dpp' : 'batch_test';

    window.history.pushState(
      {},
      '',
      `/batch/${encodeURIComponent(id)}/${name}/${urlType}`
    );
  };

  const goHome = () => {
    setActiveBatch(null);
    setActiveTest(null);
    setItems([]);
    setQuestions([]);
    setError('');
    setTestError('');
    setSubmitted(false);
    window.history.pushState({}, '', '/');
  };

  useEffect(() => {
    if (!activeBatch) return;

    let cancelled = false;

    async function loadContent() {
      setContentLoading(true);
      setError('');

      try {
        const type = contentType === 'dpp' ? 'dpp' : 'batch_test';
        const res = await axios.get(
          `${API}/api/live/${encodeURIComponent(getId(activeBatch))}/${type}`
        );

        if (!cancelled) setItems(extractList(res.data));
      } catch (e) {
        if (!cancelled) setError('Tests load nahi ho paaye.');
      } finally {
        if (!cancelled) setContentLoading(false);
      }
    }

    loadContent();

    return () => {
      cancelled = true;
    };
  }, [activeBatch, contentType]);

  const startTest = async (item) => {
    setActiveTest(item);
    setQuestions([]);
    setAnswers({});
    setCurrentQuestion(0);
    setSubmitted(false);
    setTestError('Questions load ho rahe hain...');

    const batchId = getId(activeBatch);
    const testId = getId(item);
    const batchName = encodeURIComponent(getName(activeBatch));

    try {
      const res = await axios.get(
        `${API}/test_data/${encodeURIComponent(batchId)}/${batchName}/${encodeURIComponent(testId)}/batch_test`
      );

      const detail = res.data?.data || res.data?.test || res.data;
      const list = questionListFrom(detail);

      if (!list.length) {
        setTestError(
          'Is test ke questions backend mein nahi mile. Uploader se questions aur options ke saath dobara import karna hoga.'
        );
        return;
      }

      setQuestions(list);
      setTestError('');
    } catch (e) {
      setTestError(
        e.response?.data?.message ||
        'Test details nahi mil paayi. Backend API check karo.'
      );
    }
  };

  const chooseAnswer = (questionIndex, optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const optionText = (option) => {
    if (typeof option === 'string') return option;
    return option?.text || option?.value || option?.option || option?.name || '';
  };

  const optionsFor = (question) =>
    question?.options ||
    question?.choices ||
    question?.answers ||
    [];

  const correctIndex = (question) => {
    const correct =
      question?.correctOptionIndex ??
      question?.correctIndex ??
      question?.answerIndex;

    if (Number.isInteger(correct)) return correct;

    const answer = question?.correctAnswer ?? question?.answer;
    if (answer === undefined || answer === null) return -1;

    const options = optionsFor(question);
    return options.findIndex((o) => {
      if (typeof o === 'string') return o === String(answer);
      return String(o?._id || o?.id || o?.text || o?.value || o?.option) === String(answer);
    });
  };

  const score = questions.reduce(
    (total, q, index) =>
      total + (answers[index] === correctIndex(q) ? 1 : 0),
    0
  );

  const filteredBatches = batches.filter((batch) => {
    const name = getName(batch).toLowerCase();
    const exam = String(batch.exam || batch.category || '').toUpperCase();

    return (
      name.includes(search.toLowerCase()) &&
      (category === 'ALL' || exam.includes(category))
    );
  });

  const buttonStyle = {
    padding: '10px 14px',
    border: 'none',
    borderRadius: 8,
    background: '#0284c7',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 700
  };

  const cardStyle = {
    background: '#0f172a',
    border: '1px solid #1e293b',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10
  };

  return (
    <div style={{
      background: '#070a12',
      color: '#f1f5f9',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <header style={{
        padding: '16px 20px',
        background: '#0f172a',
        borderBottom: '1px solid #1e293b',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2
          onClick={goHome}
          style={{ color: '#38bdf8', margin: 0, cursor: 'pointer', fontSize: 18 }}
        >
          ⚡ QUIZARD PW LIVE
        </h2>
        <span style={{ color: '#22c55e', fontSize: 11 }}>● LIVE CONNECTED</span>
      </header>

      <main style={{ maxWidth: 900, margin: 'auto', padding: 16 }}>
        {!activeBatch ? (
          <>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search batches..."
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: 13,
                borderRadius: 9,
                border: '1px solid #334155',
                background: '#0f172a',
                color: '#fff',
                marginBottom: 14
              }}
            />

            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {['ALL', 'NEET', 'JEE'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    ...buttonStyle,
                    flex: 1,
                    background: category === cat ? '#0284c7' : '#1e293b'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {loading ? (
              <p>Loading batches...</p>
            ) : error ? (
              <p style={{ color: '#f87171' }}>{error}</p>
            ) : filteredBatches.length === 0 ? (
              <p style={{ color: '#94a3b8' }}>No batches found.</p>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))',
                gap: 12
              }}>
                {filteredBatches.map((batch, index) => (
                  <div
                    key={getId(batch) || index}
                    onClick={() => openBatch(batch)}
                    style={{ ...cardStyle, cursor: 'pointer', margin: 0 }}
                  >
                    <strong>{getName(batch)}</strong>
                    <p style={{ color: '#94a3b8', fontSize: 12 }}>
                      {batch.language || batch.exam || 'PW Batch'}
                    </p>
                    <button style={buttonStyle}>Open Batch →</button>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : activeTest ? (
          <>
            <button onClick={() => {
              setActiveTest(null);
              setQuestions([]);
              setTestError('');
              setSubmitted(false);
            }} style={{ ...buttonStyle, marginBottom: 16 }}>
              ← Back to Tests
            </button>

            <h2>{getName(activeTest)}</h2>

            {testError && (
              <div style={{
                ...cardStyle,
                color: testError.startsWith('Questions load') ? '#facc15' : '#fca5a5'
              }}>
                {testError}
              </div>
            )}

            {questions.length > 0 && !submitted && (
              <>
                <p style={{ color: '#94a3b8' }}>
                  Question {currentQuestion + 1} of {questions.length}
                </p>

                <div style={cardStyle}>
                  <h3>
                    {questions[currentQuestion]?.questionText ||
                     questions[currentQuestion]?.question ||
                     questions[currentQuestion]?.text ||
                     `Question ${currentQuestion + 1}`}
                  </h3>

                  {optionsFor(questions[currentQuestion]).map((option, index) => (
                    <button
                      key={index}
                      onClick={() => chooseAnswer(currentQuestion, index)}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: 12,
                        marginTop: 8,
                        borderRadius: 8,
                        border: answers[currentQuestion] === index
                          ? '1px solid #38bdf8'
                          : '1px solid #334155',
                        background: answers[currentQuestion] === index
                          ? '#164e63'
                          : '#111827',
                        color: '#fff',
                        cursor: 'pointer'
                      }}
                    >
                      {String.fromCharCode(65 + index)}. {optionText(option)}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button
                    disabled={currentQuestion === 0}
                    onClick={() => setCurrentQuestion((n) => n - 1)}
                    style={{ ...buttonStyle, opacity: currentQuestion === 0 ? 0.5 : 1 }}
                  >
                    Previous
                  </button>

                  {currentQuestion < questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestion((n) => n + 1)}
                      style={buttonStyle}
                    >
                      Next →
                    </button>
                  ) : (
                    <button
                      onClick={() => setSubmitted(true)}
                      style={{ ...buttonStyle, background: '#16a34a' }}
                    >
                      Submit Test
                    </button>
                  )}
                </div>
              </>
            )}

            {submitted && (
              <div style={cardStyle}>
                <h2>Test Result</h2>
                <p>Total Questions: {questions.length}</p>
                <p>Answered: {Object.keys(answers).length}</p>
                <p>Correct: {score}</p>
                <p>Score: {score} / {questions.length}</p>
                <button
                  onClick={() => {
                    setActiveTest(null);
                    setQuestions([]);
                    setSubmitted(false);
                  }}
                  style={buttonStyle}
                >
                  Back to Tests
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <button onClick={goHome} style={{ ...buttonStyle, marginBottom: 14 }}>
              ← Back
            </button>

            <h2>{getName(activeBatch)}</h2>

            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <button
                onClick={() => setContentType('batch_test')}
                style={{ ...buttonStyle, flex: 1, background: contentType === 'batch_test' ? '#0284c7' : '#1e293b' }}
              >
                Tests
              </button>
              <button
                onClick={() => setContentType('dpp')}
                style={{ ...buttonStyle, flex: 1, background: contentType === 'dpp' ? '#16a34a' : '#1e293b' }}
              >
                DPP
              </button>
            </div>

            {contentLoading ? (
              <p>Loading content...</p>
            ) : error ? (
              <p style={{ color: '#f87171' }}>{error}</p>
            ) : items.length === 0 ? (
              <p style={{ color: '#94a3b8' }}>No {contentType === 'dpp' ? 'DPPs' : 'tests'} found.</p>
            ) : (
              items.map((item, index) => (
                <div key={getId(item) || index} style={cardStyle}>
                  <strong>{getName(item)}</strong>

                  {(item.totalQuestions || item.questions?.length) ? (
                    <p style={{ color: '#94a3b8', fontSize: 12 }}>
                      {item.totalQuestions || item.questions.length} Questions
                    </p>
                  ) : null}

                  {contentType === 'batch_test' && (
                    <button
                      onClick={() => startTest(item)}
                      style={{ ...buttonStyle, marginTop: 8 }}
                    >
                      Start Test →
                    </button>
                  )}
                </div>
              ))
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
