import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [batches, setBatches] = useState([]);
  const [activeBatch, setActiveBatch] = useState(null);
  const [contentType, setContentType] = useState('batch_test');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [error, setError] = useState('');

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------

  const getBatchId = (batch) => {
    if (!batch) return '';

    return String(
      batch._id ||
      batch.id ||
      batch.batchId ||
      batch.sourceBatchId ||
      ''
    );
  };

  const getBatchName = (batch) => {
    if (!batch) return 'Batch';

    return (
      batch.name ||
      batch.batchName ||
      batch.title ||
      'Batch'
    );
  };

  const normalizeList = (data) => {
    if (!data) return [];

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data.items)) {
      return data.items;
    }

    if (Array.isArray(data.batches)) {
      return data.batches;
    }

    if (Array.isArray(data.tests)) {
      return data.tests;
    }

    if (Array.isArray(data.dpps)) {
      return data.dpps;
    }

    if (Array.isArray(data.data)) {
      return data.data;
    }

    if (
      data.data &&
      typeof data.data === 'object'
    ) {
      if (Array.isArray(data.data.items)) {
        return data.data.items;
      }

      if (Array.isArray(data.data.batches)) {
        return data.data.batches;
      }

      if (Array.isArray(data.data.tests)) {
        return data.data.tests;
      }

      if (Array.isArray(data.data.dpps)) {
        return data.data.dpps;
      }

      if (Array.isArray(data.data.data)) {
        return data.data.data;
      }
    }

    return [];
  };

  // --------------------------------------------------
  // Load batches
  // --------------------------------------------------

  const loadBatches = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const res = await axios.get(
        '/api/pw-batches',
        {
          headers: {
            Accept: 'application/json'
          },
          timeout: 20000
        }
      );

      console.log(
        'Batches API response:',
        res.data
      );

      const list = normalizeList(res.data);

      console.log(
        'Normalized batches:',
        list
      );

      setBatches(
        Array.isArray(list)
          ? list
          : []
      );

    } catch (err) {
      console.error(
        'Batch fetch error:',
        err
      );

      setBatches([]);
      setError(
        'Unable to load batches.'
      );

    } finally {
      setLoading(false);
    }
  }, []);

  // --------------------------------------------------
  // Find batch from current URL
  // --------------------------------------------------

  const restoreRoute = useCallback(
    (batchList) => {
      const path =
        window.location.pathname;

      const match =
        path.match(
          /^\/batch\/([^/]+)\/([^/]+)\/([^/]+)\/?$/
        );

      if (!match) {
        setActiveBatch(null);
        return;
      }

      const batchId =
        decodeURIComponent(match[1]);

      const typeFromUrl =
        decodeURIComponent(match[3]);

      console.log(
        'Restoring route:',
        {
          batchId,
          typeFromUrl
        }
      );

      const batch =
        batchList.find(
          (b) =>
            getBatchId(b) ===
            String(batchId)
        );

      if (!batch) {
        console.warn(
          'Batch not found for URL:',
          batchId
        );

        setActiveBatch(null);
        return;
      }

      setActiveBatch(batch);

      if (
        typeFromUrl === 'dpp' ||
        typeFromUrl === 'dpps'
      ) {
        setContentType('dpp');
      } else {
        setContentType('batch_test');
      }
    },
    []
  );

  // --------------------------------------------------
  // Initial load
  // --------------------------------------------------

  useEffect(() => {
    loadBatches();
  }, [loadBatches]);

  // --------------------------------------------------
  // Restore route after batches load
  // --------------------------------------------------

  useEffect(() => {
    if (batches.length > 0) {
      restoreRoute(batches);
    }
  }, [
    batches,
    restoreRoute
  ]);

  // --------------------------------------------------
  // Browser Back / Forward
  // --------------------------------------------------

  useEffect(() => {
    const handlePopState = () => {
      restoreRoute(batches);
    };

    window.addEventListener(
      'popstate',
      handlePopState
    );

    return () => {
      window.removeEventListener(
        'popstate',
        handlePopState
      );
    };
  }, [
    batches,
    restoreRoute
  ]);

  // --------------------------------------------------
  // Open batch
  // --------------------------------------------------

  const handleOpenBatch = (
    batch,
    type = 'batch_test'
  ) => {
    const batchId =
      getBatchId(batch);

    if (!batchId) {
      console.error(
        'Batch ID missing:',
        batch
      );
      return;
    }

    const batchName =
      encodeURIComponent(
        getBatchName(batch)
      );

    const cleanType =
      type === 'dpp' ||
      type === 'dpps'
        ? 'dpp'
        : 'batch_test';

    console.log(
      'Opening batch:',
      {
        batchId,
        batchName,
        cleanType
      }
    );

    setItems([]);
    setError('');
    setContentType(cleanType);
    setActiveBatch(batch);

    const newUrl =
      `/batch/${encodeURIComponent(
        batchId
      )}/${batchName}/${cleanType}`;

    window.history.pushState(
      {
        batchId,
        type: cleanType
      },
      '',
      newUrl
    );
  };

  // --------------------------------------------------
  // Back to home
  // --------------------------------------------------

  const handleBack = () => {
    setActiveBatch(null);
    setItems([]);
    setError('');

    if (
      window.location.pathname !== '/'
    ) {
      window.history.pushState(
        {},
        '',
        '/'
      );
    }
  };

  // --------------------------------------------------
  // Load Tests / DPPs
  // --------------------------------------------------

  useEffect(() => {
    if (!activeBatch) {
      setItems([]);
      return;
    }

    const batchId =
      getBatchId(activeBatch);

    if (!batchId) {
      console.error(
        'Active batch ID missing:',
        activeBatch
      );

      setItems([]);
      return;
    }

    let cancelled = false;

    async function loadContent() {
      setContentLoading(true);
      setItems([]);
      setError('');

      const apiType =
        contentType === 'dpp'
          ? 'dpp'
          : 'batch_test';

      const url =
        `/api/live/${encodeURIComponent(
          batchId
        )}/${apiType}`;

      console.log(
        'Loading content:',
        url
      );

      try {
        const res =
          await axios.get(
            url,
            {
              headers: {
                Accept:
                  'application/json'
              },
              timeout: 20000
            }
          );

        if (cancelled) return;

        console.log(
          'Content API response:',
          res.data
        );

        const list =
          normalizeList(res.data);

        console.log(
          'Normalized content:',
          list
        );

        setItems(
          Array.isArray(list)
            ? list
            : []
        );

      } catch (err) {
        if (cancelled) return;

        console.error(
          'Content fetch error:',
          err
        );

        if (
          err.response
        ) {
          console.error(
            'API status:',
            err.response.status
          );

          console.error(
            'API data:',
            err.response.data
          );
        }

        setItems([]);

        setError(
          'Unable to load content for this batch.'
        );

      } finally {
        if (!cancelled) {
          setContentLoading(false);
        }
      }
    }

    loadContent();

    return () => {
      cancelled = true;
    };
  }, [
    activeBatch,
    contentType
  ]);

  // --------------------------------------------------
  // Filter batches
  // --------------------------------------------------

  const filteredBatches =
    batches.filter(
      (batch) => {
        const name =
          String(
            batch.name ||
            batch.batchName ||
            batch.title ||
            ''
          );

        const exam =
          String(
            batch.exam ||
            batch.category ||
            batch.subgroup ||
            ''
          );

        const matchesCategory =
          selectedCategory === 'ALL' ||
          exam
            .toUpperCase()
            .includes(
              selectedCategory
            );

        const matchesSearch =
          name
            .toLowerCase()
            .includes(
              searchQuery
                .toLowerCase()
            );

        return (
          matchesCategory &&
          matchesSearch
        );
      }
    );

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div
      style={{
        backgroundColor:
          '#070a12',
        color: '#f1f5f9',
        minHeight: '100vh',
        fontFamily:
          'sans-serif'
      }}
    >

      {/* Header */}

      <nav
        style={{
          backgroundColor:
            '#0f172a',
          padding:
            '14px 20px',
          display: 'flex',
          justifyContent:
            'space-between',
          alignItems:
            'center',
          borderBottom:
            '1px solid #1e293b'
        }}
      >

        <div
          style={{
            display: 'flex',
            alignItems:
              'center',
            gap: '10px',
            cursor: 'pointer'
          }}
          onClick={
            handleBack
          }
        >

          <span
            style={{
              fontSize:
                '24px'
            }}
          >
            ⚡
          </span>

          <h2
            style={{
              margin: 0,
              fontSize:
                '18px',
              color:
                '#38bdf8'
            }}
          >
            QUIZARD PW LIVE
          </h2>

        </div>

        <span
          style={{
            fontSize:
              '11px',
            color:
              '#22c55e',
            backgroundColor:
              'rgba(34, 197, 94, 0.1)',
            padding:
              '4px 10px',
            borderRadius:
              '12px',
            border:
              '1px solid #22c55e'
          }}
        >
          ● LIVE CONNECTED
        </span>

      </nav>

      <div
        style={{
          maxWidth:
            '1000px',
          margin:
            '0 auto',
          padding:
            '18px 14px'
        }}
      >

        {/* ================= HOME ================= */}

        {!activeBatch ? (

          <div>

            <input
              type="text"
              placeholder="🔍 Search live batches..."
              value={
                searchQuery
              }
              onChange={
                (e) =>
                  setSearchQuery(
                    e.target.value
                  )
              }
              style={{
                width:
                  '100%',
                padding:
                  '12px',
                borderRadius:
                  '10px',
                backgroundColor:
                  '#0f172a',
                border:
                  '1px solid #1e293b',
                color:
                  '#fff',
                marginBottom:
                  '14px',
                boxSizing:
                  'border-box'
              }}
            />

            <div
              style={{
                display:
                  'flex',
                gap:
                  '8px',
                marginBottom:
                  '18px'
              }}
            >

              {[
                'ALL',
                'NEET',
                'JEE'
              ].map(
                (cat) => (

                  <button
                    key={cat}
                    onClick={() =>
                      setSelectedCategory(
                        cat
                      )
                    }
                    style={{
                      flex: 1,
                      padding:
                        '10px',
                      borderRadius:
                        '8px',
                      border:
                        'none',
                      backgroundColor:
                        selectedCategory ===
                        cat
                          ? '#0284c7'
                          : '#0f172a',
                      color:
                        '#fff',
                      fontWeight:
                        '700',
                      cursor:
                        'pointer'
                    }}
                  >
                    {cat}
                  </button>

                )
              )}

            </div>

            {loading ? (

              <p
                style={{
                  textAlign:
                    'center',
                  color:
                    '#94a3b8'
                }}
              >
                Fetching live batches...
              </p>

            ) : error &&
              batches.length ===
                0 ? (

              <div
                style={{
                  textAlign:
                    'center',
                  padding:
                    '40px',
                  color:
                    '#f87171'
                }}
              >

                <p>
                  {error}
                </p>

                <button
                  onClick={
                    loadBatches
                  }
                  style={{
                    backgroundColor:
                      '#0284c7',
                    color:
                      '#fff',
                    border:
                      'none',
                    padding:
                      '9px 16px',
                    borderRadius:
                      '8px',
                    cursor:
                      'pointer'
                  }}
                >
                  Retry
                </button>

              </div>

            ) : filteredBatches.length ===
              0 ? (

              <div
                style={{
                  textAlign:
                    'center',
                  padding:
                    '40px',
                  color:
                    '#94a3b8'
                }}
              >

                <p>
                  No live batches found.
                </p>

              </div>

            ) : (

              <div
                style={{
                  display:
                    'grid',
                  gridTemplateColumns:
                    'repeat(2, 1fr)',
                  gap:
                    '12px'
                }}
              >

                {filteredBatches.map(
                  (
                    batch,
                    index
                  ) => (

                    <div
                      key={
                        getBatchId(
                          batch
                        ) ||
                        index
                      }
                      onClick={() =>
                        handleOpenBatch(
                          batch,
                          'batch_test'
                        )
                      }
                      style={{
                        backgroundColor:
                          '#0f172a',
                        border:
                          '1px solid #1e293b',
                        borderRadius:
                          '12px',
                        padding:
                          '14px',
                        cursor:
                          'pointer',
                        transition:
                          'transform 0.15s ease'
                      }}
                      onMouseDown={
                        (e) => {
                          e.currentTarget.style.transform =
                            'scale(0.98)';
                        }
                      }
                      onMouseUp={
                        (e) => {
                          e.currentTarget.style.transform =
                            'scale(1)';
                        }
                      }
                    >

                      <h4
                        style={{
                          margin:
                            '0 0 6px 0',
                          fontSize:
                            '13px',
                          color:
                            '#f8fafc'
                        }}
                      >
                        {getBatchName(
                          batch
                        )}
                      </h4>

                      <p
                        style={{
                          margin:
                            0,
                          fontSize:
                            '11px',
                          color:
                            '#64748b'
                        }}
                      >
                        {batch.language ||
                          batch.exam ||
                          'PW Batch'}
                      </p>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        ) : (

          /* ================= BATCH CONTENT ================= */

          <div>

            <button
              onClick={
                handleBack
              }
              style={{
                backgroundColor:
                  '#0f172a',
                border:
                  '1px solid #1e293b',
                color:
                  '#38bdf8',
                padding:
                  '8px 14px',
                borderRadius:
                  '8px',
                cursor:
                  'pointer',
                marginBottom:
                  '14px'
              }}
            >
              ← Back
            </button>

            <h3
              style={{
                color:
                  '#fff',
                marginBottom:
                  '14px'
              }}
            >
              {getBatchName(
                activeBatch
              )}
            </h3>

            {/* Tests / DPP switch */}

            <div
              style={{
                display:
                  'flex',
                gap:
                  '8px',
                marginBottom:
                  '16px'
              }}
            >

              <button
                onClick={() => {

                  setContentType(
                    'batch_test'
                  );

                  const id =
                    getBatchId(
                      activeBatch
                    );

                  const name =
                    encodeURIComponent(
                      getBatchName(
                        activeBatch
                      )
                    );

                  window.history.pushState(
                    {},
                    '',
                    `/batch/${encodeURIComponent(
                      id
                    )}/${name}/batch_test`
                  );

                }}
                style={{
                  flex: 1,
                  padding:
                    '10px',
                  borderRadius:
                    '8px',
                  border:
                    'none',
                  backgroundColor:
                    contentType ===
                    'batch_test'
                      ? '#0284c7'
                      : '#0f172a',
                  color:
                    '#fff',
                  fontWeight:
                    '700',
                  cursor:
                    'pointer'
                }}
              >
                Tests
              </button>

              <button
                onClick={() => {

                  setContentType(
                    'dpp'
                  );

                  const id =
                    getBatchId(
                      activeBatch
                    );

                  const name =
                    encodeURIComponent(
                      getBatchName(
                        activeBatch
                      )
                    );

                  window.history.pushState(
                    {},
                    '',
                    `/batch/${encodeURIComponent(
                      id
                    )}/${name}/dpp`
                  );

                }}
                style={{
                  flex: 1,
                  padding:
                    '10px',
                  borderRadius:
                    '8px',
                  border:
                    'none',
                  backgroundColor:
                    contentType ===
                    'dpp'
                      ? '#16a34a'
                      : '#0f172a',
                  color:
                    '#fff',
                  fontWeight:
                    '700',
                  cursor:
                    'pointer'
                }}
              >
                DPP
              </button>

            </div>

            {contentLoading ? (

              <p
                style={{
                  textAlign:
                    'center',
                  color:
                    '#94a3b8',
                  padding:
                    '25px'
                }}
              >
                Loading{' '}
                {contentType ===
                'dpp'
                  ? 'DPPs'
                  : 'Tests'}
                ...
              </p>

            ) : error ? (

              <div
                style={{
                  textAlign:
                    'center',
                  padding:
                    '30px',
                  color:
                    '#f87171'
                }}
              >
                {error}
              </div>

            ) : items.length ===
              0 ? (

              <div
                style={{
                  textAlign:
                    'center',
                  padding:
                    '35px',
                  color:
                    '#94a3b8'
                }}
              >

                <p>
                  No{' '}
                  {contentType ===
                  'dpp'
                    ? 'DPPs'
                    : 'tests'}{' '}
                  found for this batch.
                </p>

              </div>

            ) : (

              <div
                style={{
                  display:
                    'flex',
                  flexDirection:
                    'column',
                  gap:
                    '8px'
                }}
              >

                {items.map(
                  (
                    item,
                    idx
                  ) => (

                    <div
                      key={
                        item._id ||
                        item.id ||
                        item.sourceTestId ||
                        idx
                      }
                      style={{
                        backgroundColor:
                          '#0f172a',
                        padding:
                          '12px',
                        borderRadius:
                          '8px',
                        border:
                          '1px solid #1e293b'
                      }}
                    >

                      <p
                        style={{
                          margin:
                            0,
                          fontSize:
                            '13px',
                          color:
                            '#f8fafc'
                        }}
                      >
                        {item.title ||
                          item.name ||
                          item.testName ||
                          item.test_title ||
                          'Untitled Test'}
                      </p>

                      {(
                        item.totalQuestions ||
                        item.questions?.length
                      ) ? (

                        <small
                          style={{
                            display:
                              'block',
                            marginTop:
                              '5px',
                            color:
                              '#64748b'
                          }}
                        >
                          {item.totalQuestions ||
                            item.questions?.length}{' '}
                          Questions
                        </small>

                      ) : null}

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default App;
