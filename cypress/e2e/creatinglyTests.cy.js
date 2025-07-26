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
    cy.wait(6000);
    cy.get("#NotiflixLoadingMessage", { timeout: 60000 }).should("not.exist");


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

  describe("Chart Workflow", () => {
    it.only("should complete full chart workflow with viewport changes", () => {
      // 1) Open the Templates panel
      cy.get('[aria-label="Click to get the Templates of Desktop and Mobile devices."]', { timeout: 60000 })
        .click();
      cy.get('[aria-label="layout_section2"]', { timeout: 60000 })
        .should("exist");
  
      // 2) Scroll to the Chart icon and hover once to open the side‑panel
      cy.get('[data-testid="Chart"]', { timeout: 60000 })
        .scrollIntoView()
        .trigger("mouseover", { force: true })
        // adjust this assertion to whatever your app uses to mark “open”
        .should("have.attr", "aria-expanded", "true");
  
      // 3) Select the Pie Chart
      cy.get('[data-testid="Pie Chart"]', { timeout: 60000 })
        .first()
        .should("be.visible")
        .click();
  
      // 4) Open the Properties tab
      cy.get('[title="Properties"]', { timeout: 60000 })
        .click();
  
      // 5) Click the 5th button in the properties grid
      cy.get("div.grid-align-container > button.btn", { timeout: 60000 })
        .eq(4)
        .click();
    });
  });
  


});

