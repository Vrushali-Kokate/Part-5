const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // no special events
    },
    baseUrl: 'http://localhost:5173'  // your frontend runs here
  },
})
