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
    cy.wait(4000);
    cy.contains("Loading...", { timeout: 60000 }).should("not.exist");
    cy.wait(4000);
    cy.contains("Loading Design, Please wait..", { timeout: 60000 }).should("not.exist");


    // Check if we're in the layout section, if not create master page
    cy.get('body').then(($body) => {
      const hasLayoutSection = $body.find('#section1.layout-style').length > 0;
      if (!hasLayoutSection) {
        return
      } else {
        cy.get('[aria-label="Clear"]', { timeout: 60000 }).click();
        cy.get('.NXConfirmButtonOk'), { timeout: 60000 }.click();
      }
    });
  });

  it.only("should complete full chart workflow with viewport changes", () => {
    cy.get('[aria-label="Click to get the Templates of Desktop and Mobile devices."]', { timeout: 60000 }).click();
    cy.get('[aria-label="layout_section2"]', { timeout: 60000 }).should("exist");

    // Try multiple hover techniques to open the chart panel
    cy.get('[data-testid="Chart"]', { timeout: 60000 }).scrollIntoView().should("exist");
    
    // // Technique 1: Try the "Charts" section first (as in ChartPage)
    // cy.get('[data-testid="Charts"]', { timeout: 60000 }).should("exist").trigger("mouseover");
    // cy.wait(1000);
    
    // Technique 2: Standard hover on Chart element
    cy.get('[data-testid="Chart"]').trigger("mouseover");
    cy.wait(500);
    
    // Technique 3: Mouse enter and move
    cy.get('[data-testid="Chart"]').trigger("mouseenter").trigger("mousemove");
    cy.wait(500);
    
    // Technique 4: Force hover with position
    cy.get('[data-testid="Chart"]').trigger("mouseover", { force: true, position: { x: 10, y: 10 } });
    cy.wait(500);
    
    // Technique 5: Try clicking instead of hover
    cy.get('[data-testid="Chart"]').click({ force: true });
    cy.wait(1000);
    
    // Technique 6: Try right-click context menu
    cy.get('[data-testid="Chart"]').rightclick({ force: true });
    cy.wait(500);
    cy.wait(3000);
    cy.get('[data-testid="Pie Chart"]', { timeout: 60000 }).eq(0).should("exist").trigger("mousedown", { which: 1, button: 0 });
    cy.get('[aria-label="layout_section1"]', { timeout: 60000 }).trigger("mousemove").trigger("mouseup", { force: true });

    cy.get('[title="Properties"]', { timeout: 60000 }).click();
    cy.get("div.grid-align-container > button.btn", { timeout: 60000 }).eq(4).click();

  });


});

