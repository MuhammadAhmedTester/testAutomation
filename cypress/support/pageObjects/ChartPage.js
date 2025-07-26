class ChartPage {
  elements = {
    // Navigation and setup elements
    templatesPanel: () => cy.get('[aria-label="Click to get the Templates of Desktop and Mobile devices."]', { timeout: 60000 }),
    layoutSection: () => cy.get('[aria-label="layout_section1"]', { timeout: 60000 }),
    chartIcon: () => cy.get('[data-testid="Chart"]', { timeout: 60000 }),
    container1: () => cy.get('#Container1', { timeout: 60000 }),
    propertiesTab: () => cy.get(".grid-align-container > :nth-child(5)", { timeout: 60000 }),
    
    // Loading and confirmation elements
    loadingMessage: () => cy.contains("Loading...", { timeout: 60000 }),
    notiflixLoadingMessage: () => cy.get("#NotiflixLoadingMessage", { timeout: 60000 }),
    clearButton: () => cy.get('[aria-label="Clear"]', { timeout: 60000 }),
    confirmButton: () => cy.get(".NXConfirmButtonOk", { timeout: 60000 }),
    
    // Layout section check
    layoutSectionCheck: () => cy.get("#section1.layout-style"),
    
    // Chart elements
    chartsSection: () => cy.get('[data-testid="Charts"]', { timeout: 40000 }),
    pieChartElement: () => cy.get('[data-testid="Pie Chart"]', { timeout: 40000 }),
    placedChart: () => cy.get('[data-testid="Chart1"]', { timeout: 40000 }),
  };

  // Setup and navigation methods
  openTemplatesPanel() {
    this.elements.templatesPanel().click();
    this.elements.layoutSection().should("exist");
    return this;
  }

  dragChartToSection() {
    this.elements.chartIcon()
      .scrollIntoView()
      .should("exist")
      .trigger("mousedown", { which: 1, force: true });

    this.elements.layoutSection()
      .trigger("mousemove")
      .trigger("mouseup", { force: true });

    return this;
  }

  clickContainer1() {
    this.elements.container1().click();
    return this;
  }

  openPropertiesTab() {
    this.elements.propertiesTab().click();
    return this;
  }

  // Setup and initialization methods
  handleLayoutSection() {
    cy.get("body").then(($body) => {
      const hasLayoutSection = $body.find("#section1.layout-style").length > 0;
      if (!hasLayoutSection) {
        return;
      } else {
        this.elements.clearButton().click();
        this.elements.confirmButton().click();
      }
    });
    return this;
  }

  waitForPageLoad() {
    cy.wait(4000);
    this.elements.loadingMessage().should("not.exist");
    cy.wait(6000);
    this.elements.notiflixLoadingMessage().should("not.exist");
    return this;
  }

  // Chart specific methods
  hoverOverChartsSection() {
    this.elements.chartsSection().should("exist").trigger("mouseover");
    return this;
  }

  findAndDragPieChart() {
    this.hoverOverChartsSection();
    this.elements.pieChartElement().should("exist");
    this.elements.pieChartElement().trigger("mousedown", { which: 1, button: 0 });
    this.elements.layoutSection().trigger("mousemove").trigger("mouseup", { force: true });
    this.elements.placedChart().should("exist", { timeout: 5000 });
    return this;
  }

  verifyChartPlaced() {
    this.elements.placedChart().should("exist").and("be.visible");
    return this;
  }
}

export default ChartPage; 