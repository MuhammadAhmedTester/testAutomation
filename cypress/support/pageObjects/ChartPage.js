class ChartPage {
    elements = {
        welcomeContainer: () => cy.get('#welcome.welcome-container'),
        createTemplatesBtn: () => cy.get('[name="Create Templates"]'),
        
        layoutSection: () => cy.get('#section1.layout-style'),
        
        chartsSection: () => cy.get('[data-testid="Charts"]'),
        pieChartElement: () => cy.get('[data-testid="Pie Chart"]'),
        chartElement: () => cy.get('[data-testid="Chart"]'),
        
        propertiesTab: () => cy.get('[data-testid="Properties"]'),
        alignmentGrid: () => cy.get('.grid-align-container'),
        centerCenterButton: () => cy.get('.grid-align-container .btn').contains('C C'),
        
        mobileView: () => cy.get('.fal.fa-mobile'),
        tabletView: () => cy.get('.fal.fa-tablet'),
        desktopView: () => cy.get('.fal.fa-desktop'),
        
        placedChart: () => cy.get('[data-testid="Chart1"]'),
        chartTitle: () => cy.get('[data-testid="Custom Chart Title"]'),
        
        resizeValueInput: () => cy.get('div.size-container.ng-star-inserted > app-value-unit').eq(3).get('.value'),
        
        errorMessage: () => cy.get('.error-message, .validation-error'),
        loadingSpinner: () => cy.get('.loading, .spinner')
    }

    visitPlatform() {
        cy.visit('https://stg.platform.creatingly.com/apps', {
            timeout: 90000,
            failOnStatusCode: false,
            headers: {
                'Accept-Encoding': 'identity'
            }
        });
        return this;
    }

    waitForPageLoad() {
        cy.get('body').should('be.visible');
        cy.get('#welcome, .welcome-container, [name="Create Templates"]').should('exist', { timeout: 30000 });
        return this;
    }

    createMasterPage() {
        this.elements.welcomeContainer().should('be.visible');
        this.elements.createTemplatesBtn().click();
        this.elements.layoutSection().should("be.visible").should("exist", { timeout: 10000 });
        return this;
    }

    checkChartAvailability() {
        this.elements.chartsSection().should('exist');
        
        this.elements.chartsSection().trigger('mouseover');
        
        this.elements.pieChartElement().should('exist');
        return this;
    }

    dragAndDropPieChart() {
        this.elements.pieChartElement().trigger('mouseover');
        
        this.elements.pieChartElement()
            .trigger('mousedown', { which: 1, button: 0 });
        
        this.elements.layoutSection()
            .trigger('mousemove')
            .trigger('mouseup', { force: true });
        
        this.elements.placedChart().should('exist', { timeout: 5000 });
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
        cy.get('body').click();
        return this;
    }

    tryDragChartWithoutLayout() {
        this.elements.pieChartElement().trigger('mouseover');
        this.elements.pieChartElement()
            .trigger('mousedown', { which: 1, button: 0 });
        
        cy.get('body').trigger('mousemove').trigger('mouseup');
        return this;
    }

    tryInvalidResize() {
        this.elements.resizeValueInput().click().clear().type('invalid_value');
        cy.get('body').click();
        return this;
    }

    tryResizeWithNegativeValue() {
        this.elements.resizeValueInput().click().clear().type('-100');
        cy.get('body').click();
        return this;
    }

    tryResizeWithZeroValue() {
        this.elements.resizeValueInput().click().clear().type('0');
        cy.get('body').click();
        return this;
    }

    verifyChartExists() {
        this.elements.placedChart().should('exist').and('be.visible');
        return this;
    }

    verifyPieChartExists() {
        this.elements.pieChartElement().should('exist').and('be.visible');
        return this;
    }

    verifyChartSize(expectedSize) {
        this.elements.resizeValueInput().should('have.value', expectedSize);
        return this;
    }

    verifyLayoutSection() {
        this.elements.layoutSection().should('exist').and('be.visible');
        return this;
    }

    verifyMobileView() {
        this.elements.mobileView().should('have.class', 'selected');
        return this;
    }

    verifyTabletView() {
        this.elements.tabletView().should('have.class', 'selected');
        return this;
    }

    verifyDesktopView() {
        this.elements.desktopView().should('have.class', 'selected');
        return this;
    }

    verifyErrorDisplayed() {
        this.elements.errorMessage().should('be.visible');
        return this;
    }

    verifyNoErrorDisplayed() {
        this.elements.errorMessage().should('not.exist');
        return this;
    }

    verifyChartNotPlaced() {
        this.elements.placedChart().should('not.exist');
        return this;
    }
}

export default ChartPage; 