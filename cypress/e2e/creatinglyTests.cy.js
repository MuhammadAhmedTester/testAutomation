import ChartPage from "../support/pageObjects/ChartPage";
import "cypress-real-events/support";
import "../support/command/commands.js";
require("@4tw/cypress-drag-drop");

describe("Chart Page Automation Tests", () => {
  const chartPage = new ChartPage();

  before(() => {
    cy.viewport(1920, 1080);
    cy.clearCookies();
    // Visit the page with proper configuration
    cy.visit("https://stg.platform.creatingly.com/apps", {
      timeout: 90000,
      failOnStatusCode: false,
      headers: {
        "Accept-Encoding": "identity",
      },
    });

    // Wait for page to load completely
    chartPage.waitForPageLoad();

    // Check for master page and clear if found
    cy.get("body").then(($body) => {
      const masterPageExists = $body.find("#MasterPage").length > 0;

      if (masterPageExists) {
        cy.log("Master page found - clearing template");
        chartPage.elements.clearButton().click({ force: true });
        chartPage.elements.confirmButton().click({ force: true });
        cy.log("Template reset completed");
      } else {
        cy.log("No master page found - proceeding with tests");
      }
    });

    chartPage.chooseDesktopView();
  });

  describe("Chart Workflow - Happy Path", () => {
    it("should complete full chart workflow with viewport changes", () => {
      // Open the Templates panel to access chart components
      chartPage.openTemplatesPanel();

      cy.get('#draw-drawing-panel').click();
      cy.wait(2000); // Wait for the panel to open
      cy.get('.right-cards > .home-card-list').eq(0).click();

      // Hover over the Chart icon before drag and drop (using real mouse event)
      cy.get('[data-testid="Chart"]').realHover();

      // Drag the Chart icon into section 1 to add it to the layout
      // chartPage.dragChartToSection();

      // drag and drop the chart
      cy.get('[data-testid="Line Chart"]').drag("#Artboard1 > #section1", {
        source: { x: 50, y: 50 },
        target: {position: "left"},
        force: true,
      });

      // Assert that the chart was placed successfully
      chartPage.elements.chart1().should("exist").and("be.visible");

      // Click on Chart1 to select the chart element
      chartPage.clickChart1();

      // Open the Properties tab to configure chart settings
      chartPage.openPropertiesTab();
    });
  });

  // describe("Chart Workflow - Negative Test Cases", () => {
  //   beforeEach(() => {
  //     cy.visit("https://stg.platform.creatingly.com/apps", {
  //       timeout: 90000,
  //       failOnStatusCode: false,
  //       headers: {
  //         "Accept-Encoding": "identity",
  //       },
  //     });
  //     chartPage.waitForPageLoad();

  //     // Check if #Chart1 is present in section1
  //     cy.get("body").then(($body) => {
  //       const hasSection =
  //         $body.find(chartPage.elements.layoutSection).length > 0;
  //       if (hasSection) {
  //         // Reset template through clear and confirm buttons
  //         chartPage.elements.clearButton().click();
  //         chartPage.elements.confirmButton().click();
  //         cy.log("Template reset completed - Chart was found and cleared");
  //       } else {
  //         cy.log("No Chart found - proceeding directly to tests");
  //       }
  //     });
  //   });

  //   it("should handle network timeout when opening templates panel", () => {
  //     // Simulate slow network by intercepting the request
  //     cy.intercept("GET", "**/apps**", { delay: 10000 }).as("slowTemplates");

  //     // Attempt to open templates panel with timeout
  //     cy.get(
  //       '[aria-label="Click to get the Templates of Desktop and Mobile devices."]',
  //       { timeout: 5000 }
  //     ).should("not.exist");
  //   });

  //   it("should handle chart element not found scenario", () => {
  //     chartPage.openTemplatesPanel();

  //     // Try to interact with non-existent chart element
  //     cy.get('[data-testid="NonExistentChart"]', { timeout: 5000 }).should(
  //       "not.exist"
  //     );

  //     // Verify the page is still functional
  //     chartPage.elements.layoutSection().should("exist");
  //   });

  //   it("should handle invalid drag and drop operation", () => {
  //     chartPage.openTemplatesPanel();

  //     // Try to drag from empty area to layout section
  //     cy.get("body").trigger("mousedown", { which: 1, force: true });
  //     chartPage.elements
  //       .layoutSection()
  //       .trigger("mousemove")
  //       .trigger("mouseup", { force: true });

  //     // Verify no chart was placed
  //     cy.get("#Chart1").should("not.exist");
  //   });

  //   it("should handle multiple rapid clicks on Chart", () => {
  //     // Rapidly click the chart Icon multiple times
  //     for (let i = 0; i < 5; i++) {
  //       chartPage.elements.chartIcon().click({ force: true });
  //     }
  //     chartPage.elements.layoutSection().click({ force: true });
  //     // Verify only one panel is opened
  //     chartPage.elements.layoutSection().should("exist");
  //   });

  //   it("should handle chart drag with invalid coordinates", () => {
  //     chartPage.openTemplatesPanel();

  //     // Try to drag chart to invalid coordinates
  //     chartPage.elements
  //       .chartIcon()
  //       .scrollIntoView()
  //       .should("exist")
  //       .trigger("mousedown", { which: 1, force: true });

  //     // Drag to invalid coordinates (outside viewport)
  //     cy.get("body").trigger("mousemove", { clientX: 9999, clientY: 9999 });
  //     cy.get("body").trigger("mouseup", { force: true });

  //     // Verify chart was not placed
  //     cy.get("#Chart1").should("not.exist");
  //   });
  // });

  // describe("Chart Workflow - Edge Cases", () => {
  //   beforeEach(() => {
  //     cy.visit("https://stg.platform.creatingly.com/apps", {
  //       timeout: 90000,
  //       failOnStatusCode: false,
  //       headers: {
  //         "Accept-Encoding": "identity",
  //       },
  //     });
  //     chartPage.waitForPageLoad();

  //     // Check if #Chart1 is present in section1
  //     cy.get("body").then(($body) => {
  //       const hasSection =
  //         $body.find(chartPage.elements.layoutSection).length > 0;
  //       if (hasSection) {
  //         // Reset template through clear and confirm buttons
  //         chartPage.elements.clearButton().click();
  //         chartPage.elements.confirmButton().click();
  //         cy.log("Template reset completed - Chart was found and cleared");
  //       } else {
  //         cy.log("No Chart found - proceeding directly to tests");
  //       }
  //     });
  //   });

  //   it("should handle page refresh during chart workflow", () => {
  //     chartPage.openTemplatesPanel();
  //     chartPage.dragChartToSection();

  //     // Refresh page mid-workflow
  //     cy.reload();
  //     chartPage.waitForPageLoad();

  //     // Verify page is still functional
  //     chartPage.elements.templatesPanel().should("exist");
  //   });

  //   it("should handle browser back/forward navigation", () => {
  //     chartPage.openTemplatesPanel();
  //     chartPage.dragChartToSection();

  //     // Navigate back
  //     cy.go("back");
  //     cy.go("forward");

  //     // Verify page state is maintained
  //     chartPage.waitForPageLoad();
  //     chartPage.elements.templatesPanel().should("exist");
  //   });

  //   it("should handle viewport size changes during workflow", () => {
  //     chartPage.elements.clearButton().click({ force: true });
  //     chartPage.elements.confirmButton().click({ force: true });
  //     // Start with mobile viewport
  //     cy.viewport(375, 667);
  //     chartPage.openTemplatesPanel();

  //     // Change to desktop viewport
  //     cy.viewport(1920, 1080);
  //     chartPage.dragChartToSection();

  //     // Change to tablet viewport
  //     cy.viewport(768, 1024);
  //     chartPage.clickChart1();

  //     // Verify functionality across viewports
  //     chartPage.elements.propertiesTab().should("exist");
  //   });

  //   it("should handle slow internet connection simulation", () => {
  //     // Intercept all requests and add delay
  //     cy.intercept("**/*", { delay: 2000 }).as("slowNetwork");

  //     chartPage.openTemplatesPanel();
  //     cy.wait("@slowNetwork");

  //     chartPage.dragChartToSection();
  //     cy.wait("@slowNetwork");

  //     // Verify workflow completes despite slow network
  //     chartPage.elements.chart1().should("exist");
  //   });

  //   it("should handle chart removal and re-placement", () => {
  //     chartPage.openTemplatesPanel();
  //     chartPage.dragChartToSection();

  //     // Remove the chart (if clear functionality exists)
  //     chartPage.elements.clearButton().click({ force: true });
  //     chartPage.elements.confirmButton().click({ force: true });

  //     // Verify chart is removed
  //     cy.get("#Chart1").should("not.exist");

  //     // Place chart again
  //     chartPage.dragChartToSection();
  //     cy.get("#Chart1").should("exist");
  //   });

  //   it("should handle concurrent user interactions", () => {
  //     chartPage.openTemplatesPanel();

  //     // Simulate concurrent interactions
  //     chartPage.elements.chartIcon().click({ force: true });
  //     chartPage.elements.layoutSection().click({ force: true });
  //     chartPage.elements.chart1().click({ force: true });

  //     // Verify page remains stable
  //     chartPage.elements.templatesPanel().should("exist");
  //   });
  // });

  // describe(
  //   "Chart Workflow - Boundary Conditions",
  //   { testIsolation: false },
  //   () => {
  //     beforeEach(() => {
  //       cy.visit("https://stg.platform.creatingly.com/apps", {
  //         timeout: 90000,
  //         failOnStatusCode: false,
  //         headers: {
  //           "Accept-Encoding": "identity",
  //         },
  //       });
  //       chartPage.waitForPageLoad();

  //       // Check if #Chart1 is present in section1
  //       cy.get("body").then(($body) => {
  //         const hasSection =
  //           $body.find(chartPage.elements.layoutSection).length > 0;
  //         if (hasSection) {
  //           // Reset template through clear and confirm buttons
  //           chartPage.elements.clearButton().click();
  //           chartPage.elements.confirmButton().click();
  //           cy.log("Template reset completed - Chart was found and cleared");
  //         } else {
  //           cy.log("No Chart found - proceeding directly to tests");
  //         }
  //       });
  //     });

  //     it("should handle minimum viewport size", () => {
  //       // chartPage.elements.clearButton().click({ force: true });
  //       // chartPage.elements.confirmButton().click({ force: true });
  //       cy.viewport(320, 568); // Minimum mobile viewport
  //       chartPage.openTemplatesPanel();
  //       chartPage.dragChartToSection();
  //       chartPage.clickChart1();

  //       // Verify functionality at minimum size
  //       chartPage.elements.propertiesTab().should("exist");
  //     });

  //     it("should handle maximum viewport size", () => {
  //       chartPage.elements.clearButton().click({ force: true });
  //       chartPage.elements.confirmButton().click({ force: true });
  //       cy.viewport(2560, 1440); // Large desktop viewport
  //       chartPage.openTemplatesPanel();
  //       chartPage.dragChartToSection();
  //       chartPage.clickChart1();

  //       // Verify functionality at maximum size
  //       chartPage.elements.propertiesTab().should("exist");
  //     });
  //   }
  // );
});
