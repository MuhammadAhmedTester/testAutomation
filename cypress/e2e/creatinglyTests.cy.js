import ChartPage from "../support/pageObjects/ChartPage";
import "cypress-real-events/support";
import "../support/command/commands.js";
require("@4tw/cypress-drag-drop");

describe("Chart Page Automation Tests", () => {
  const chartPage = new ChartPage();

  beforeEach(() => {
    cy.viewport("macbook-16");
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
  });

  describe("Chart Workflow - Happy Path", () => {
    it("should complete full chart workflow with viewport changes (Desktop View)", () => {
      //select the device
      chartPage.chooseDesktopView();

      // Open the Templates panel to access chart components
      chartPage.openMasterPage();

      // Hover over the Chart icon before drag and drop (using real mouse event)
      chartPage.elements.chartPaletteIcon().realHover();

      // drag and drop the chart
      chartPage.dragChartToSection();

      // Assert that the chart was placed successfully
      chartPage.elements.chart1().should("exist").and("be.visible");

      // Click on Chart1 to select the chart element
      chartPage.clickChart1();

      // Open the Properties tab to configure chart settings and position the chart
      chartPage.positionChart();
    });

    it("should complete full chart workflow with viewport changes (Tablet View)", () => {
      //select the device
      chartPage.chooseTabletView();

      // Open the Templates panel to access chart components
      chartPage.openMasterPage();

      // Hover over the Chart icon before drag and drop (using real mouse event)
      chartPage.elements.chartPaletteIcon().realHover();

      // drag and drop the chart
      chartPage.dragChartToSection();

      // Assert that the chart was placed successfully
      chartPage.elements.chart1().should("exist").and("be.visible");

      // Click on Chart1 to select the chart element
      chartPage.clickChart1();

      // Open the Properties tab to configure chart settings and position the chart
      chartPage.positionChart();
    });

    it("should complete full chart workflow with viewport changes (Mobile View)", () => {
      //select the device
      // chartPage.chooseMobileView();

      // Open the Templates panel to access chart components
      chartPage.openMasterPage();

      // Hover over the Chart icon before drag and drop (using real mouse event)
      chartPage.elements.chartPaletteIcon().realHover();

      // drag and drop the chart
      chartPage.dragChartToSection();

      // Assert that the chart was placed successfully
      chartPage.elements.chart2().should("exist").and("be.visible");

      // Click on Chart1 to select the chart element
      chartPage.clickChart1();

      // Open the Properties tab to configure chart settings and position the chart
      chartPage.positionChart();
    });
  });

  describe("Chart Workflow - Negative Test Cases", () => {
    it("should not place chart outside the section", () => {
      chartPage.openMasterPage();
      chartPage.elements.section1().should("be.visible");
      // drag and drop the chart outside the section
      chartPage.dragChartOutsideTheSection();
      cy.contains("Please Select traget section. Something is wrong.").should(
        "exist"
      );
      chartPage.elements.chart1().should("not.exist");
    });

    it("should not place chart on Master page", () => {
      chartPage.openMasterPage();
      chartPage.elements.masterPage().should("be.visible");
      // drag and drop the chart outside the section
      chartPage.dragChartOnMasterPage();
      cy.contains("There is no section to add element.").should("exist");
      chartPage.elements.chart1().should("not.exist");
    });
  });

  describe("Chart Workflow - Edge Cases", () => {
    it("should place chart successfully under slow network conditions", () => {
      cy.intercept("**/*", { delay: 2000 }).as("slowNetwork");
      chartPage.openMasterPage();
      chartPage.elements.chartPaletteIcon().realHover();
      chartPage.dragChartToSection();
      cy.wait("@slowNetwork");
      chartPage.elements.chart3().should("exist");
    });

    it("should handle viewport change during drag", () => {
      chartPage.openMasterPage();
      chartPage.elements.chartPaletteIcon().realHover();
      cy.viewport(375, 667); // Mobile
      chartPage.dragChartToSection();
      cy.viewport(1920, 1080); // Desktop
      chartPage.elements.chart3().should("exist");
    });

    it("should allow chart removal and re-placement", () => {
      chartPage.openMasterPage();
      chartPage.elements.chartPaletteIcon().realHover();
      chartPage.dragChartToSection();
      // chartPage.elements.clearButton().click({ force: true });
      // chartPage.elements.confirmButton().click({ force: true });
      chartPage.elements.chart1.click();
      chartPage.elements.deleteChart().click();
      chartPage.elements.chart1().should("not.exist");
      chartPage.dragChartToSection();
      chartPage.elements.chart1().should("exist");
    });
  });
});
