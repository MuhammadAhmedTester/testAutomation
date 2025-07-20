class ChartPage {
    // Selectors
    elements = {
        createTemplatesBtn: () => cy.get('[name="Create Templates"]'),
        layoutSection: () => cy.get('[aria-label="layout_section1"]'),
        chartElement: () => cy.get('[data-testid="Chart"]'),
        chartDraggable: () => cy.get('.chart'),
        recenterButton: () => cy.get('div.grid-align-container > .btn'),
        resizeValueInput: () => cy.get('div.size-container.ng-star-inserted > app-value-unit').eq(3).get('.value'),
        tabletView: () => cy.get('fal fa-tablet selected')
    }

    // Actions
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

    changeScreenView() {
        this.elements.tabletView().click();
    }

    verifyPlatformAccess() {
        cy.url().should('include', 'stg.platform.creatingly.com', { timeout: 10000 });
        cy.get('body').should('be.visible');
        return this;
    }

    createMasterPage() {
        this.elements.createTemplatesBtn().click();
        this.elements.layoutSection().should("be.visible").should("exist");
        return this;
    }

    dragAndDropChart() {
        this.elements.chartElement().scrollIntoView().trigger('mouseover');
        this.elements.chartDraggable().should('be.visible').click();
        this.elements.chartDraggable()
            .trigger('mousedown', { which: 1 });
        this.elements.layoutSection()
            .trigger('mousemove')
            .trigger('mouseup', { force: true });
        return this;
    }

    recenterChart() {
        this.elements.recenterButton().click();
        return this;
    }

    resizeChart(size) {
        this.elements.resizeValueInput().click().clear().type(size);
        cy.get('body').click(); // Click away to apply changes
        return this;
    }

    // Verifications
    verifyChartExists() {
        this.elements.chartDraggable().should('exist').and('be.visible');
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
}

export default ChartPage; 