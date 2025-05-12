
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://vogelfreipreview.skyops.pro/",
    video: true,
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 720,
    specPattern: [
    "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    ],

    setupNodeEvents(on, config) {
    },
  },
});
