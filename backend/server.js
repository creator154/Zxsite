const express = require('express');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 3000;

const PANEL_BACKEND =
  (
    process.env.PANEL_BACKEND_URL ||
    'https://panel1-18e1d76be41d.herokuapp.com'
  ).replace(/\/$/, '');


/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true
  })
);


/* =========================================================
   REACT BUILD
========================================================= */

const FRONTEND_BUILD = path.join(
  __dirname,
  '..',
  'frontend',
  'build'
);

console.log(
  'Frontend build path:',
  FRONTEND_BUILD
);

app.use(
  express.static(FRONTEND_BUILD)
);


/* =========================================================
   PANEL BACKEND FETCH
========================================================= */

async function fetchFromPanel(url) {

  console.log(
    'Panel request:',
    url
  );

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  });

  const text = await response.text();

  let data = {};

  try {

    data = text
      ? JSON.parse(text)
      : {};

  } catch (error) {

    console.error(
      'Panel returned invalid JSON:',
      text.slice(0, 500)
    );

    throw new Error(
      `Panel returned invalid JSON (${response.status})`
    );
  }

  if (!response.ok) {

    console.error(
      `Panel error ${response.status}:`,
      data
    );

    throw new Error(
      data.message ||
      data.error ||
      `Panel API returned ${response.status}`
    );
  }

  return data;
}


/* =========================================================
   NORMALIZE LIST
========================================================= */

function extractList(data) {

  if (Array.isArray(data)) {
    return data;
  }

  if (
    data &&
    Array.isArray(data.items)
  ) {
    return data.items;
  }

  if (
    data &&
    Array.isArray(data.batches)
  ) {
    return data.batches;
  }

  if (
    data &&
    Array.isArray(data.tests)
  ) {
    return data.tests;
  }

  if (
    data &&
    Array.isArray(data.dpps)
  ) {
    return data.dpps;
  }

  if (
    data &&
    Array.isArray(data.data)
  ) {
    return data.data;
  }

  if (
    data &&
    data.data &&
    Array.isArray(data.data.items)
  ) {
    return data.data.items;
  }

  if (
    data &&
    data.data &&
    Array.isArray(data.data.batches)
  ) {
    return data.data.batches;
  }

  if (
    data &&
    data.data &&
    Array.isArray(data.data.tests)
  ) {
    return data.data.tests;
  }

  if (
    data &&
    data.data &&
    Array.isArray(data.data.dpps)
  ) {
    return data.data.dpps;
  }

  if (
    data &&
    data.data &&
    Array.isArray(data.data.data)
  ) {
    return data.data.data;
  }

  return [];
}


/* =========================================================
   PUBLIC BATCHES
========================================================= */

app.get(
  '/api/pw-batches',
  async (req, res) => {

    try {

      const data =
        await fetchFromPanel(
          `${PANEL_BACKEND}/api/public/batches`
        );

      const batches =
        extractList(data);

      console.log(
        'Public batches:',
        batches.length
      );

      return res.json({
        success: true,
        batches
      });

    } catch (error) {

      console.error(
        'Public batches error:',
        error.message
      );

      return res.status(500).json({
        success: false,
        error: 'Failed to load batches',
        message: error.message
      });
    }
  }
);


/* =========================================================
   PUBLIC TEST / DPP
========================================================= */

app.get(
  '/api/live/:batchId/:contentType',
  async (req, res) => {

    try {

      const {
        batchId,
        contentType
      } = req.params;

      let type;

      if (
        contentType === 'batch_test' ||
        contentType === 'test' ||
        contentType === 'tests'
      ) {

        type = 'test';

      } else if (
        contentType === 'dpp' ||
        contentType === 'dpps'
      ) {

        type = 'dpp';

      } else {

        return res.status(400).json({
          success: false,
          error: 'Invalid content type'
        });
      }

      const targetUrl =
        `${PANEL_BACKEND}/api/public/batches/${encodeURIComponent(batchId)}/${type}`;

      const data =
        await fetchFromPanel(targetUrl);

      const items =
        extractList(data);

      console.log(
        'Public content:',
        {
          batchId,
          type,
          count: items.length
        }
      );

      return res.json({
        success: true,
        items
      });

    } catch (error) {

      console.error(
        'Public content error:',
        error.message
      );

      return res.status(500).json({
        success: false,
        error: 'Failed to load content',
        message: error.message
      });
    }
  }
);


/* =========================================================
   TEST DETAILS
========================================================= */

app.get(
  '/test_data/:batchId/:batchName/:testId/batch_test',
  async (req, res) => {

    try {

      const {
        batchId,
        testId
      } = req.params;

      const targetUrl =
        `${PANEL_BACKEND}/api/public/batches/${encodeURIComponent(batchId)}/test`;

      const data =
        await fetchFromPanel(targetUrl);

      const tests =
        extractList(data);

      const found =
        tests.find(item => {

          const id =
            String(
              item._id ||
              item.id ||
              item.sourceTestId ||
              item.testId ||
              ''
            );

          return (
            id === String(testId)
          );
        });

      if (!found) {

        return res.status(404).json({
          success: false,
          error: 'Test not found'
        });
      }

      return res.json({
        success: true,
        data: found,
        test: found
      });

    } catch (error) {

      console.error(
        'Test detail error:',
        error.message
      );

      return res.status(500).json({
        success: false,
        error: 'Failed to fetch test details',
        message: error.message
      });
    }
  }
);


/* =========================================================
   HEALTH
========================================================= */

app.get(
  '/api/health',
  (req, res) => {

    return res.json({
      success: true,
      server: 'Public Site Backend',
      panelBackend: PANEL_BACKEND,
      status: 'connected'
    });
  }
);


/* =========================================================
   REACT ROUTER FALLBACK
========================================================= */

app.get(
  '*',
  (req, res) => {

    res.sendFile(
      path.join(
        FRONTEND_BUILD,
        'index.html'
      )
    );
  }
);


/* =========================================================
   START
========================================================= */

app.listen(
  PORT,
  () => {

    console.log(
      `Public site server running on port ${PORT}`
    );

    console.log(
      `Panel backend: ${PANEL_BACKEND}`
    );

  }
);
