class ChartPage {
  elements = {
    chartsSection: () => cy.get('[data-testid="Charts"]', { timeout: 40000 }),
    pieChartElement: () => cy.get('[data-testid="Pie Chart"]', { timeout: 40000 }),
    layoutSection: () => cy.get('[aria-label="layout_section1"]', { timeout: 40000 }),
    placedChart: () => cy.get('[data-testid="Chart1"]', { timeout: 40000 }),
  };

  hoverOverChartsSection() {
    // Hover over the Charts section to expand it
    this.elements.chartsSection().should("exist").trigger("mouseover");
    return this;
  }

  findAndDragPieChart() {
    // First hover over charts section to make pie chart visible
    this.hoverOverChartsSection();
    
    // Find the Pie Chart element
    this.elements.pieChartElement().should("exist");
    
    // Drag the pie chart to the layout section
    this.elements.pieChartElement().trigger("mousedown", { which: 1, button: 0 });
    
    // Move to layout section and drop
    this.elements.layoutSection().trigger("mousemove").trigger("mouseup", { force: true });
    
    // Verify the chart was placed
    this.elements.placedChart().should("exist", { timeout: 5000 });
    
    return this;
  }

  verifyChartPlaced() {
    this.elements.placedChart().should("exist").and("be.visible");
    return this;
  }
}

export default ChartPage; 