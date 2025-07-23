import ChartPage from "../support/pageObjects/ChartPage";

describe("Chart Page Automation Tests", () => {
  const chartPage = new ChartPage();

  before(() => {
    // Visit the platform and set up clean state
    chartPage.visitPlatform();
    chartPage.checkPageState();

    // Check if we're in the layout section, if not create master page
    cy.get("body").then(($body) => {
      const hasLayoutSection = $body.find("#section1.layout-style").length > 0;

      if (!hasLayoutSection) {
        // Create master page to get to layout section
        chartPage.createMasterPage();
      }

      // Analyze if chart is present in section, click on it and delete if found
      chartPage.analyzeAndDeleteChartIfPresent();
    });
  });

  describe("Happy Path Tests", { testIsolation: false }, () => {
    it.only("should complete full chart workflow with viewport changes", () => {
      chartPage.createMasterPage();
      chartPage.verifyLayoutSection();
    });

    it("should check the availability of piechart and drag and drop it on section1", () => {
      chartPage.checkChartAvailability();
      chartPage.verifyPieChartExists();

      chartPage.dragAndDropPieChart();
      chartPage.verifyChartExists();
    });

    it("should be able to recenter the dropped pie chart", () => {
      chartPage.recenterChart();
    });
  });
});
