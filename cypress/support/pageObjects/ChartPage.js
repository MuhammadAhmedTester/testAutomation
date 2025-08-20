require("@4tw/cypress-drag-drop");
class ChartPage {
  elements = {
    // Navigation and setup elements
    masterPageButton: () =>
      cy
        .get(
          '[aria-label="Click to get the Templates of Desktop and Mobile devices."]',
          { timeout: 60000 }
        )
        .scrollIntoView(),
    layoutSection: () =>
      cy.get('[aria-label="layout_section1"]', {
        timeout: 60000,
        source: { x: 50, y: 50 },
        target: { position: "center" },
        force: true,
      }),
    masterPage: () => cy.get("#MasterPagSection3", { timeout: 60000 }),
    section1: () => cy.get("#Artboard1 > #section1", { timeout: 60000 }),
    desktopView: () => cy.get(".fa-desktop", { timeout: 60000 }),
    mobileView: () => cy.get(".fa-mobile", { timeout: 60000 }),
    tabletView: () => cy.get(".fa-tablet", { timeout: 60000 }),
    chartPaletteIcon: () => cy.get('[data-testid="Chart"]', { timeout: 60000 }),
    playground: () => cy.get("#Playground", { timeout: 60000 }),
    container1: () => cy.get("#Container1", { timeout: 60000 }),
    chart1: () => cy.get("#Chart1", { timeout: 60000 }),
    chartCenterButton: () =>
      cy.get(".grid-align-container > :nth-child(5)", { timeout: 60000 }),
    chartTopLeftButton: () =>
      cy.get(".grid-align-container > :nth-child(3)", { timeout: 60000 }),

    // Loading and confirmation elements
    loadingMessage: () => cy.get(".text-container", { timeout: 60000 }),
    notiflixLoadingMessage: () =>
      cy.get("#NotiflixLoadingMessage", { timeout: 60000 }),
    clearButton: () => cy.get('[aria-label="Clear"]', { timeout: 60000 }),
    confirmButton: () => cy.get("#NXConfirmButtonOk", { timeout: 60000 }),

    // Layout section check
    layoutSectionCheck: () => cy.get("#section1.layout-style"),

    // Chart elements
    pieChartElement: () =>
      cy.get('[data-testid="Pie Chart"]', { timeout: 40000 }),
    lineChartElement: () =>
      cy.get('[data-testid="Line Chart"]', { timeout: 40000 }),
    placedChart: () => cy.get("#Chart1", { timeout: 40000 }),

    // Additional elements for negative tests
    allCharts: () => cy.get('[data-testid^="Chart"]'),
    focusedElement: () => cy.focused(),
  };

  // Setup and navigation methods
  openMasterPage() {
    this.elements.masterPageButton().click();
    this.elements.layoutSection().should("exist");
    return this;
  }

  chooseDesktopView() {
    this.elements.desktopView().click();
    cy.wait(3000);
    this.elements.confirmButton().click({ force: true });
    return this;
  }

  chooseMobileView() {
    this.elements.mobileView().click();
    cy.wait(3000);
    this.elements.confirmButton().click({ force: true });
    return this;
  }

  chooseTabletView() {
    this.elements.tabletView().click();
    cy.wait(3000);
    this.elements.confirmButton().click({ force: true });
    return this;
  }

  clickChart1() {
    this.elements.chart1().click();
    return this;
  }

  dragChartToSection() {
    this.elements.chartPaletteIcon().drag('[aria-label="layout_section1"]', {
      timeout: 60000,
      source: { x: 50, y: 50 },
      target: { position: "center" },
      force: true,
    });
    this.elements.section1().click();
  }

  dragChartOutsideTheSection() {
    this.elements.chartPaletteIcon().drag("#playground", { timeout: 60000 });
  }

  dragChartOnMasterPage() {
    this.elements.chartPaletteIcon().drag("#MasterPage > #MasterPagSection3", { timeout: 60000 });
  }

  positionChart() {
    this.elements.chartCenterButton().click();
    cy.wait(2000);
    this.elements.chartTopLeftButton().click();
    cy.wait(2000);
    this.elements.chartCenterButton().click();
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

  // New efficient initialization method
  initializePage() {
    this.waitForPageLoad();

    // Check for existing master page and clear if found
    cy.get("body").then(($body) => {
      const masterPageExists = $body.find("#MasterPage").length > 0;

      if (masterPageExists) {
        cy.log("Master page found - clearing template");
        this.elements.clearButton().click({ force: true });
        this.elements.confirmButton().click({ force: true });
        cy.wait(1000); // Brief wait for cleanup
      } else {
        cy.log("No master page found - proceeding with tests");
      }
    });

    return this;
  }

  waitForPageLoad() {
    cy.wait(4000);
    this.elements.loadingMessage().should("not.exist");
    cy.wait(6000);
    this.elements.notiflixLoadingMessage().should("not.exist");
    cy.wait(6000);
    return this;
  }

  // Negative test methods
  verifyElementNotExists(selector, timeout = 5000) {
    cy.get(selector, { timeout }).should("not.exist");
    return this;
  }

  performInvalidDragOperation() {
    cy.get("body").trigger("mousedown", { which: 1, force: true });
    this.elements
      .layoutSection()
      .trigger("mousemove")
      .trigger("mouseup", { force: true });
    return this;
  }

  rapidClickElement(element, count = 5) {
    for (let i = 0; i < count; i++) {
      element.click({ force: true });
    }
    return this;
  }

  dragToInvalidCoordinates() {
    this.elements
      .chartIcon()
      .scrollIntoView()
      .should("exist")
      .trigger("mousedown", { which: 1, force: true });

    cy.get("body").trigger("mousemove", { clientX: 9999, clientY: 9999 });
    cy.get("body").trigger("mouseup", { force: true });
    return this;
  }

  // Edge case methods
  simulateSlowNetwork(delay = 2000) {
    cy.intercept("**/*", { delay }).as("slowNetwork");
    return this;
  }

  placeMultipleCharts(count = 3) {
    for (let i = 0; i < count; i++) {
      this.dragChartToSection();
      cy.wait(1000);
    }
    return this;
  }

  removeAndReplaceChart() {
    this.elements.clearButton().click({ force: true });
    this.elements.confirmButton().click({ force: true });
    this.dragChartToSection();
    return this;
  }

  performConcurrentInteractions() {
    this.elements.chartIcon().click({ force: true });
    this.elements.layoutSection().click({ force: true });
    this.elements.container1().click({ force: true });
    return this;
  }

  testMemoryIntensiveOperations(iterations = 10) {
    for (let i = 0; i < iterations; i++) {
      this.elements.chartIcon().scrollIntoView();
      cy.wait(100);
    }
    return this;
  }

  // Boundary condition methods
  setViewportSize(width, height) {
    cy.viewport(width, height);
    return this;
  }

  performRapidMouseMovements() {
    this.elements
      .chartIcon()
      .trigger("mouseover")
      .trigger("mouseout")
      .trigger("mouseover")
      .trigger("mouseout")
      .trigger("mouseover");
    return this;
  }

  testKeyboardNavigation(tabCount = 3) {
    for (let i = 0; i < tabCount; i++) {
      cy.get("body").tab();
    }
    return this;
  }

  // Validation methods
  verifyPageStability() {
    this.elements.templatesPanel().should("exist");
    this.elements.chartIcon().should("be.visible");
    return this;
  }

  verifyMultipleChartsExist(expectedCount = 3) {
    this.elements.allCharts().should("have.length.at.least", expectedCount);
    return this;
  }

  verifyChartRemoved() {
    this.elements.placedChart().should("not.exist");
    return this;
  }

  verifyFocusManagement() {
    this.elements.focusedElement().should("exist");
    return this;
  }

  // Network simulation methods
  simulateNetworkTimeout(endpoint, delay = 10000) {
    cy.intercept("GET", endpoint, { delay }).as("networkTimeout");
    return this;
  }

  waitForNetworkRequest(alias) {
    cy.wait(alias);
    return this;
  }
}

export default ChartPage;
