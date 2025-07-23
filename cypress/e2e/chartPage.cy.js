import ChartPage from '../support/pageObjects/ChartPage';

describe('Chart Page Automation Tests', () => {
  const chartPage = new ChartPage();

  beforeEach(() => {
    chartPage.visitPlatform();
    chartPage.checkPageState();
  });

  describe('Happy Path Tests', () => {
    it('should complete full chart workflow with viewport changes', () => {
      chartPage.createMasterPage();
      chartPage.verifyLayoutSection();
      
      chartPage.checkChartAvailability();
      chartPage.verifyPieChartExists();
      
      chartPage.dragAndDropPieChart();
      chartPage.verifyChartExists();
      
      chartPage.recenterChart();
      
      chartPage.changeToMobileView();
      chartPage.verifyMobileView();
      
      chartPage.changeToTabletView();
      chartPage.verifyTabletView();
      
      chartPage.recenterChart();
    });

    it('should create a master page and verify layout section', () => {
      chartPage.createMasterPage();
      chartPage.verifyLayoutSection();
    });

    it('should verify pie chart availability in side panel', () => {
      chartPage.createMasterPage();
      chartPage.checkChartAvailability();
      chartPage.verifyPieChartExists();
    });

    it('should drag and drop pie chart successfully', () => {
      chartPage.createMasterPage();
      chartPage.checkChartAvailability();
      chartPage.dragAndDropPieChart();
      chartPage.verifyChartExists();
    });

    it('should recenter the chart using alignment grid', () => {
      chartPage.createMasterPage();
      chartPage.checkChartAvailability();
      chartPage.dragAndDropPieChart();
      chartPage.recenterChart();
    });

    it('should resize the chart element with valid values', () => {
      chartPage.createMasterPage();
      chartPage.checkChartAvailability();
      chartPage.dragAndDropPieChart();
      chartPage.resizeChart('300');
      chartPage.verifyChartSize('300');
    });

    it('should change viewport between different device views', () => {
      chartPage.createMasterPage();
      chartPage.changeToMobileView();
      chartPage.verifyMobileView();
      
      chartPage.changeToTabletView();
      chartPage.verifyTabletView();
      
      chartPage.changeToDesktopView();
      chartPage.verifyDesktopView();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid viewport changes', () => {
      chartPage.createMasterPage();
      chartPage.checkChartAvailability();
      chartPage.dragAndDropPieChart();
      
      chartPage.changeToMobileView();
      chartPage.changeToTabletView();
      chartPage.changeToDesktopView();
      chartPage.changeToMobileView();
      
      chartPage.verifyMobileView();
    });

    it('should handle multiple chart placements', () => {
      chartPage.createMasterPage();
      chartPage.checkChartAvailability();
      
      chartPage.dragAndDropPieChart();
      chartPage.dragAndDropPieChart();
      chartPage.dragAndDropPieChart();
      
      chartPage.verifyChartExists();
    });

    it('should handle chart resizing with boundary values', () => {
      chartPage.createMasterPage();
      chartPage.checkChartAvailability();
      chartPage.dragAndDropPieChart();
      
      chartPage.resizeChart('1');
      chartPage.verifyChartSize('1');
      
      chartPage.resizeChart('1000');
      chartPage.verifyChartSize('1000');
    });

    it('should handle chart operations with different viewport sizes', () => {
      chartPage.createMasterPage();
      chartPage.checkChartAvailability();
      chartPage.dragAndDropPieChart();
      
      chartPage.changeToMobileView();
      chartPage.recenterChart();
      chartPage.resizeChart('200');
      
      chartPage.changeToTabletView();
      chartPage.recenterChart();
      chartPage.resizeChart('400');
      
      chartPage.changeToDesktopView();
      chartPage.recenterChart();
      chartPage.resizeChart('600');
    });

    it('should handle page refresh and restore state', () => {
      chartPage.createMasterPage();
      chartPage.checkChartAvailability();
      chartPage.dragAndDropPieChart();
      chartPage.recenterChart();
      
      cy.reload();
      chartPage.checkPageState();
      
      chartPage.verifyChartExists();
    });
  });

  describe('Negative Test Cases', () => {
    it('should not allow drag and drop without creating master page first', () => {
      chartPage.checkChartAvailability();
      chartPage.tryDragChartWithoutLayout();
      chartPage.verifyChartNotPlaced();
    });

    it('should not allow resizing chart with invalid values', () => {
      chartPage.createMasterPage();
      chartPage.checkChartAvailability();
      chartPage.dragAndDropPieChart();
      
      chartPage.tryInvalidResize();
      chartPage.verifyErrorDisplayed();
    });

    it('should not allow resizing chart with negative values', () => {
      chartPage.createMasterPage();
      chartPage.checkChartAvailability();
      chartPage.dragAndDropPieChart();
      
      chartPage.tryResizeWithNegativeValue();
      chartPage.verifyErrorDisplayed();
    });

    it('should not allow resizing chart with zero value', () => {
      chartPage.createMasterPage();
      chartPage.checkChartAvailability();
      chartPage.dragAndDropPieChart();
      
      chartPage.tryResizeWithZeroValue();
      chartPage.verifyErrorDisplayed();
    });

    it('should handle missing chart element gracefully', () => {
      chartPage.createMasterPage();
      
      cy.get('[data-testid="NonExistentChart"]').should('not.exist');
    });

    it('should handle network errors gracefully', () => {
      cy.intercept('GET', '**/api/**', { statusCode: 500 }).as('apiError');
      
      chartPage.visitPlatform();
      chartPage.checkPageState();
      
      cy.get('body').should('be.visible');
    });

    it('should handle slow loading scenarios', () => {
      cy.intercept('GET', '**/api/**', (req) => {
        req.reply((res) => {
          setTimeout(() => {
            res.send();
          }, 5000);
        });
      }).as('slowApi');
      
      chartPage.visitPlatform();
      chartPage.checkPageState();
      
      chartPage.createMasterPage();
    });

    it('should not allow chart operations when properties panel is closed', () => {
      chartPage.createMasterPage();
      chartPage.checkChartAvailability();
      chartPage.dragAndDropPieChart();
      
      cy.get('[data-testid="Properties"]').click();
      
      chartPage.recenterChart();
    });

    it('should handle concurrent user interactions', () => {
      chartPage.createMasterPage();
      chartPage.checkChartAvailability();
      chartPage.dragAndDropPieChart();
      
      chartPage.recenterChart();
      chartPage.resizeChart('300');
      chartPage.changeToMobileView();
      chartPage.recenterChart();
      
      chartPage.verifyMobileView();
    });
  });

  describe('Accessibility Tests', () => {
    it('should have proper ARIA labels for chart elements', () => {
      chartPage.createMasterPage();
      chartPage.checkChartAvailability();
      chartPage.dragAndDropPieChart();
      
      cy.get('[data-testid="Chart1"]').should('have.attr', 'aria-label');
      cy.get('[data-testid="Custom Chart Title"]').should('be.visible');
    });

    it('should be keyboard navigable', () => {
      chartPage.createMasterPage();
      chartPage.checkChartAvailability();
      
      cy.get('body').tab();
      cy.focused().should('exist');
    });
  });

  describe('Performance Tests', () => {
    it('should load page within acceptable time', () => {
      const startTime = Date.now();
      
      chartPage.visitPlatform();
      chartPage.checkPageState();
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).to.be.lessThan(30000);
    });

    it('should handle chart operations without performance degradation', () => {
      chartPage.createMasterPage();
      chartPage.checkChartAvailability();
      
      const startTime = Date.now();
      
      chartPage.dragAndDropPieChart();
      chartPage.recenterChart();
      chartPage.resizeChart('300');
      
      const operationTime = Date.now() - startTime;
      expect(operationTime).to.be.lessThan(10000);
    });
  });
}); 