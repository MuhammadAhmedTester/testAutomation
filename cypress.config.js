const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://stg.platform.creatingly.com/apps/",
    video: true,
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 720,
    specPattern: [
      "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    ],
    
    defaultCommandTimeout: 10000,
    requestTimeout: 30000,
    responseTimeout: 30000,
    pageLoadTimeout: 60000,
    
    // retries: {
    //   runMode: 2,
    //   openMode: 1
    // },
    
    env: {
      validChartSize: '300',
      invalidChartSize: 'invalid_value',
      negativeChartSize: '-100',
      zeroChartSize: '0',
      
      elementTimeout: 10000,
      pageLoadTimeout: 30000,
      operationTimeout: 10000,
      
      maxPageLoadTime: 30000,
      maxOperationTime: 10000
    },

    setupNodeEvents(on, config) {
      on('after:spec', (spec, results) => {
        if (results && results.video) {
          if (results.stats.failures === 0) {
            require('fs').unlinkSync(results.video);
          }
        }
      });
      
      on('after:screenshot', (details) => {
        return details;
      });
    },
  },
  
  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack',
    },
  },
}); 