const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const PORT = process.env.PORT || 3000;
const root = path.join(__dirname, "public");

/* =========================
   BATCH CATALOG
========================= */

const batches = [];

function addBatch(id, name, category, exam, medium, count = 10) {
  batches.push({
    id,
    name,
    category,
    exam,
    medium,
    count,
    paid: true
  });
}

function addVersions(prefix, title, category, exam, medium, versions = 4) {
  for (let i = 1; i <= versions; i++) {
    addBatch(
      `${prefix}-${medium.toLowerCase()}-${i}`,
      `${title} ${i}.0`,
      category,
      exam,
      medium,
      12 + i
    );
  }
}

/* =========================
   NEET - ENGLISH
========================= */

addVersions(
  "neet-yakeen",
  "Yakeen",
  "NEET Tests",
  "NEET",
  "English",
  5
);

addVersions(
  "neet-arjuna",
  "Arjuna",
  "NEET Tests",
  "NEET",
  "English",
  4
);

addVersions(
  "neet-lakshya",
  "Lakshya",
  "NEET Tests",
  "NEET",
  "English",
  4
);

/* =========================
   NEET - HINDI
========================= */

addVersions(
  "neet-yakeen",
  "Yakeen",
  "NEET Tests",
  "NEET",
  "Hindi",
  5
);

addVersions(
  "neet-arjuna",
  "Arjuna",
  "NEET Tests",
  "NEET",
  "Hindi",
  4
);

addVersions(
  "neet-lakshya",
  "Lakshya",
  "NEET Tests",
  "NEET",
  "Hindi",
  4
);

/* =========================
   JEE - ENGLISH
========================= */

addVersions(
  "jee-arjuna",
  "Arjuna",
  "JEE Tests",
  "JEE",
  "English",
  4
);

addVersions(
  "jee-lakshya",
  "Lakshya",
  "JEE Tests",
  "JEE",
  "English",
  4
);

addVersions(
  "jee-prayas",
  "Prayas",
  "JEE Tests",
  "JEE",
  "English",
  4
);

/* =========================
   JEE - HINDI
========================= */

addVersions(
  "jee-arjuna",
  "Arjuna",
  "JEE Tests",
  "JEE",
  "Hindi",
  4
);

addVersions(
  "jee-lakshya",
  "Lakshya",
  "JEE Tests",
  "JEE",
  "Hindi",
  4
);

addVersions(
  "jee-prayas",
  "Prayas",
  "JEE Tests",
  "JEE",
  "Hindi",
  4
);

/* =========================
   BOARDS
========================= */

addBatch(
  "class10-english",
  "Class 10 Board Test Series",
  "Boards Level Tests",
  "BOARDS",
  "English",
  15
);

addBatch(
  "class10-hindi",
  "Class 10 Board Test Series",
  "Boards Level Tests",
  "BOARDS",
  "Hindi",
  15
);

addBatch(
  "class12-english",
  "Class 12 Board Test Series",
  "Boards Level Tests",
  "BOARDS",
  18
);

addBatch(
  "class12-hindi",
  "Class 12 Board Test Series",
  "Boards Level Tests",
  "BOARDS",
  "Hindi",
  18
);

/* =========================
   OTHER
========================= */

addBatch(
  "neet-test-series",
  "NEET Full Syllabus Test Series",
  "Other Batch Tests",
  "NEET",
  "English",
  20
);

addBatch(
  "neet-test-series-hindi",
  "NEET Full Syllabus Test Series",
  "Other Batch Tests",
  "NEET",
  "Hindi",
  20
);

addBatch(
  "jee-test-series",
  "JEE Full Syllabus Test Series",
  "Other Batch Tests",
  "JEE",
  "English",
  20
);

addBatch(
  "jee-test-series-hindi",
  "JEE Full Syllabus Test Series",
  "Other Batch Tests",
  "JEE",
  "Hindi",
  20
);

/* =========================
   TEST DATA
========================= */

const testNames = [
  "Chapter Test 01",
  "Chapter Test 02",
  "Minor Test 01",
  "Minor Test 02",
  "Major Test 01",
  "Major Test 02",
  "Full Syllabus Test 01",
  "Full Syllabus Test 02",
  "Revision Test 01",
  "Grand Test 01",
  "Grand Test 02",
  "Mock Test 01"
];

function testsFor(batchId) {
  const batch = batches.find((b) => b.id === batchId);

  if (!batch) return [];

  return testNames.slice(0, Math.min(batch.count, testNames.length)).map(
    (name, index) => ({
      id: `${batchId}-test-${index + 1}`,
      name: `${batch.name} - ${name}`,
      questions: 30 + index * 5,
      duration: 45 + index * 5,
      date: `${String((index % 25) + 1).padStart(2, "0")} Oct 2026`,
      instructions: [
        "Read every question carefully.",
        "Select only one answer for each question.",
        "Do not refresh the page while attempting the test.",
        "The test will automatically submit when the timer ends.",
        "Check your answers before submitting."
      ]
    })
  );
}

/* =========================
   HELPERS
========================= */

function json(res, data, status = 200) {
  const body = JSON.stringify(data);

  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });

  res.end(body);
}

function safeFile(p) {
  const decoded = decodeURIComponent(p);

  if (decoded.includes("..")) return null;

  const relative =
    decoded === "/" ? "index.html" : decoded.replace(/^\/+/, "");

  const file = path.join(root, relative);

  return file.startsWith(root) ? file : null;
}

/* =========================
   SERVER
========================= */

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;

  /* CONFIG */

  if (pathname === "/api/config") {
    return json(res, {
      brand: "Zxsite",
      tagline: "Your Ultimate Exam Preparation Platform"
    });
  }

  /* ALL BATCHES */

  if (pathname === "/api/batches") {
    const q = String(parsed.query.q || "")
      .trim()
      .toLowerCase();

    const exam = String(parsed.query.exam || "")
      .trim()
      .toUpperCase();

    const medium = String(parsed.query.medium || "")
      .trim()
      .toLowerCase();

    let result = [...batches];

    if (q) {
      result = result.filter((b) =>
        `${b.name} ${b.category} ${b.exam} ${b.medium}`
          .toLowerCase()
          .includes(q)
      );
    }

    if (exam) {
      result = result.filter((b) => b.exam === exam);
    }

    if (medium) {
      result = result.filter(
        (b) => b.medium.toLowerCase() === medium
      );
    }

    return json(res, result);
  }

  /* BATCH TESTS */

  let match = pathname.match(
    /^\/api\/batches\/([^/]+)\/tests$/
  );

  if (match) {
    return json(res, testsFor(match[1]));
  }

  /* SINGLE TEST */

  match = pathname.match(/^\/api\/tests\/([^/]+)$/);

  if (match) {
    const testId = match[1];

    for (const batch of batches) {
      const test = testsFor(batch.id).find(
        (t) => t.id === testId
      );

      if (test) {
        return json(res, {
          ...test,
          batch
        });
      }
    }

    return json(
      res,
      { error: "Test not found" },
      404
    );
  }

  /* STATIC FILE */

  const file = safeFile(pathname);

  if (!file) {
    return json(res, { error: "Not found" }, 404);
  }

  fs.stat(file, (err, stat) => {
    if (err || !stat.isFile()) {
      return json(
        res,
        { error: "Not found" },
        404
      );
    }

    const extension = path.extname(file);

    const contentTypes = {
      ".html": "text/html; charset=utf-8",
      ".css": "text/css; charset=utf-8",
      ".js": "application/javascript; charset=utf-8",
      ".json": "application/json; charset=utf-8",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".svg": "image/svg+xml"
    };

    res.writeHead(200, {
      "Content-Type":
        contentTypes[extension] ||
        "application/octet-stream"
    });

    fs.createReadStream(file).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Zxsite running on port ${PORT}`);
});
