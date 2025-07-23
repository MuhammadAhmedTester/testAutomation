import ChartPage from "../support/pageObjects/ChartPage";

describe("Chart Page Automation Tests", () => {
  const chartPage = new ChartPage();

  before(() => {
    chartPage.visitPlatform();
    chartPage.checkPageState();
  });

  describe("Happy Path Tests", {testIsolation: false}, () => {
    it("should complete full chart workflow with viewport changes", () => {
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
