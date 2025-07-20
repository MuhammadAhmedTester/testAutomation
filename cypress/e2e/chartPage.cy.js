import ChartPage from '../support/pageObjects/ChartPage';

describe('Chart Page Automation Tests', () => {
  const chartPage = new ChartPage();

  beforeEach(() => {
    chartPage.visitPlatform();
    chartPage.verifyPlatformAccess();
  });

  it('should create a master page', () => {
    chartPage.createMasterPage();
    chartPage.verifyLayoutSection();
  });

  it('should drag and drop chart element', () => {
    chartPage.createMasterPage();
    chartPage.dragAndDropChart();
    chartPage.verifyChartExists();
  });

  it('should recenter the chart', () => {
    chartPage.createMasterPage();
    chartPage.dragAndDropChart();
    chartPage.recenterChart();
    // Optionally, add assertion for chart position if possible
  });

  it('should resize the chart element', () => {
    chartPage.createMasterPage();
    chartPage.dragAndDropChart();
    chartPage.resizeChart('300');
    chartPage.verifyChartSize('300');
  });

  it('should change screen view to tablet', () => {
    chartPage.changeScreenView();
    // Optionally, add assertion for tablet view
  });

  it('should not allow resizing chart with invalid value', () => {
    chartPage.createMasterPage();
    chartPage.dragAndDropChart();
    chartPage.resizeChart('invalid');
    // Add assertion for error/validation if the app provides feedback
  });

  // Additional negative test: Drag chart without layout section (if possible to simulate)
  // it('should handle drag and drop when layout section is missing', () => {
  //   // Simulate layout section missing (if possible)
  //   // chartPage.dragAndDropChart();
  //   // Add assertion for error/notification
  // });
}); 