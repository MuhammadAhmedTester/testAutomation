import ChartPage from "../support/pageObjects/ChartPage";

describe("Chart Page Automation Tests", () => {
  const chartPage = new ChartPage();

  before(() => {
    cy.visit("https://stg.platform.creatingly.com/apps", {
      timeout: 90000,
      failOnStatusCode: false,
      headers: {
        "Accept-Encoding": "identity",
      },
    });
    chartPage.waitForPageLoad();
    chartPage.handleLayoutSection();
  });

  describe("Chart Workflow", () => {
    it.only("should complete full chart workflow with viewport changes", () => {
      // Open the Templates panel to access chart components
      chartPage.openTemplatesPanel();

      // Drag the Chart icon into section 1 to add it to the layout
      chartPage.dragChartToSection();

      // Click on Container1 to select the chart element
      chartPage.clickContainer1();

      // Open the Properties tab to configure chart settings
      chartPage.openPropertiesTab();
    });
  });
});
