class ChartPage {
  elements = {
    welcomeContainer: () => cy.get("#welcome.welcome-container", { timeout: 40000 }),
    createTemplatesBtn: () => cy.get('[name="Create Templates"]', { timeout: 40000 }),

    layoutSection: () => cy.get("#section1.layout-style", { timeout: 40000 }),

    chartsSection: () => cy.get('[data-testid="Charts"]', { timeout: 40000 }),
    pieChartElement: () => cy.get('[data-testid="Pie Chart"]', { timeout: 40000 }),
    chartElement: () => cy.get('[data-testid="Chart"]', { timeout: 40000 }),

    propertiesTab: () => cy.get('[data-testid="Properties"]', { timeout: 40000 }),
    alignmentGrid: () => cy.get(".grid-align-container", { timeout: 40000 }),
    centerCenterButton: () =>
      cy.get(".grid-align-container .btn").contains("C | C", { timeout: 40000 }),

    mobileView: () => cy.get(".fal.fa-mobile", { timeout: 40000 }),
    tabletView: () => cy.get(".fal.fa-tablet", { timeout: 40000 }),
    desktopView: () => cy.get(".fal.fa-desktop", { timeout: 40000 }),

    placedChart: () => cy.get('[data-testid="Chart1"]', { timeout: 40000 }),
    chartTitle: () => cy.get('[data-testid="Custom Chart Title"]', { timeout: 40000 }),

    resizeValueInput: () =>
      cy
        .get("div.size-container.ng-star-inserted > app-value-unit", { timeout: 40000 })
        .eq(3)
        .get(".value", { timeout: 40000 }),

    errorMessage: () => cy.get(".error-message, .validation-error", { timeout: 40000 }),
    loadingSpinner: () => cy.get(".loading, .spinner", { timeout: 60000 }),
  };

  visitPlatform() {
    cy.visit("https://stg.platform.creatingly.com/apps", {
      timeout: 90000,
      failOnStatusCode: false,
      headers: {
        "Accept-Encoding": "identity",
      },
    });
    
    // Wait for the page to be fully loaded before proceeding
    cy.waitForAppToLoad();
    cy.waitForPageLoad();
    
    return this;
  }

  waitForPageLoad() {
    // Simple check to ensure page is ready
    cy.get(".text-container", { timeout: 40000 }).should("not.be.visible");
    
    cy.loadingSpinner().should("not.be.visible");
    
    return this;
  }

  createMasterPage() {
    cy.waitForPageLoad();
    // Wait for either the welcome container or create templates button to be available
    cy.get('#welcome.welcome-container, [name="Create Templates"]', { timeout: 60000 })
      .should('exist')
      .then(($elements) => {
        if ($elements.length > 0) {
          // If welcome container exists, wait for it to be visible
          if ($elements.is('#welcome.welcome-container')) {
            cy.get('#welcome.welcome-container', { timeout: 60000 }).should('be.visible');
          }
          
          // Click the create templates button
          cy.get('[name="Create Templates"]', { timeout: 60000 }).click();
          
          // Wait for layout section to appear
          cy.get('#section1.layout-style', { timeout: 40000 })
            .should('be.visible')
            .should('exist');
        }
      });
    
    return this;
  }

  checkChartAvailability() {
    this.elements.chartsSection().should("exist");

    this.elements.chartsSection().trigger("mouseover");

    this.elements.pieChartElement().should("exist");
    return this;
  }

  dragAndDropPieChart() {
    this.elements.pieChartElement().trigger("mouseover");

    this.elements
      .pieChartElement()
      .trigger("mousedown", { which: 1, button: 0 });

    this.elements
      .layoutSection()
      .trigger("mousemove")
      .trigger("mouseup", { force: true });

    this.elements.placedChart().should("exist", { timeout: 5000 });
    return this;
  }

  recenterChart() {
    this.elements.propertiesTab().click();

    this.elements.centerCenterButton().click();
    return this;
  }

  changeToMobileView() {
    this.elements.mobileView().click();
    cy.wait(1000);
    return this;
  }

  changeToTabletView() {
    this.elements.tabletView().click();
    cy.wait(1000);
    return this;
  }

  changeToDesktopView() {
    this.elements.desktopView().click();
    cy.wait(1000);
    return this;
  }

  resizeChart(size) {
    this.elements.resizeValueInput().click().clear().type(size);
    cy.get("body").click();
    return this;
  }

  tryDragChartWithoutLayout() {
    this.elements.pieChartElement().trigger("mouseover");
    this.elements
      .pieChartElement()
      .trigger("mousedown", { which: 1, button: 0 });

    cy.get("body").trigger("mousemove").trigger("mouseup");
    return this;
  }

  tryInvalidResize() {
    this.elements.resizeValueInput().click().clear().type("invalid_value");
    cy.get("body").click();
    return this;
  }

  tryResizeWithNegativeValue() {
    this.elements.resizeValueInput().click().clear().type("-100");
    cy.get("body").click();
    return this;
  }

  tryResizeWithZeroValue() {
    this.elements.resizeValueInput().click().clear().type("0");
    cy.get("body").click();
    return this;
  }

  verifyChartExists() {
    this.elements.placedChart().should("exist").and("be.visible");
    return this;
  }

  verifyPieChartExists() {
    this.elements.pieChartElement().should("exist").and("be.visible");
    return this;
  }

  verifyChartSize(expectedSize) {
    this.elements.resizeValueInput().should("have.value", expectedSize);
    return this;
  }

  verifyLayoutSection() {
    this.elements.layoutSection().should("exist").and("be.visible");
    return this;
  }

  verifyMobileView() {
    this.elements.mobileView().should("have.class", "selected");
    return this;
  }

  verifyTabletView() {
    this.elements.tabletView().should("have.class", "selected");
    return this;
  }

  verifyDesktopView() {
    this.elements.desktopView().should("have.class", "selected");
    return this;
  }

  verifyErrorDisplayed() {
    this.elements.errorMessage().should("be.visible");
    return this;
  }

  verifyNoErrorDisplayed() {
    this.elements.errorMessage().should("not.exist");
    return this;
  }

  verifyChartNotPlaced() {
    this.elements.placedChart().should("not.exist");
    return this;
  }

  checkPageState() {
    // Check what state the page is currently in
    cy.get('body').then(($body) => {
      const hasWelcome = $body.find('#welcome.welcome-container').length > 0;
      const hasCreateTemplates = $body.find('[name="Create Templates"]').length > 0;
      const hasLayoutSection = $body.find('#section1.layout-style').length > 0;
      
      if (hasLayoutSection) {
        cy.log('Page is already in layout section');
      } else if (hasCreateTemplates) {
        cy.log('Page has create templates button');
      } else if (hasWelcome) {
        cy.log('Page has welcome container');
      } else {
        cy.log('Page state unknown - waiting for elements to load');
        cy.wait(4000);
      }
    });
    
    return this;
  }
}

export default ChartPage;
