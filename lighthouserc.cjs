module.exports = {
  ci: {
    collect: {
      startServerCommand: "node --import ./tests/fixtures/install-fetch.mjs tests/support/ssr-server.mjs",
      startServerReadyPattern: "Deterministic SSR test server",
      url: [
        "http://127.0.0.1:4179/",
        "http://127.0.0.1:4179/shaykh",
        "http://127.0.0.1:4179/durous",
        "http://127.0.0.1:4179/artikel",
        "http://127.0.0.1:4179/artikel/fiqh-grundlagen",
      ],
      numberOfRuns: 2,
      settings: {
        chromeFlags: "--headless --no-sandbox --disable-dev-shm-usage",
        onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.5 }],
        "categories:seo": ["error", { minScore: 1 }],
        "largest-contentful-paint": ["warn", { maxNumericValue: 4500 }],
        "cumulative-layout-shift": ["warn", { maxNumericValue: 0.15 }],
        "total-byte-weight": ["warn", { maxNumericValue: 1600000 }],
      },
    },
    upload: { target: "filesystem", outputDir: "./lighthouse-reports" },
  },
};
