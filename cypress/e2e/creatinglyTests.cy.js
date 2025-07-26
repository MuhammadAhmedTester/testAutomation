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
    cy.get("body").then(($body) => {
      const hasLayoutSection = $body.find("#section1.layout-style").length > 0;
      if (!hasLayoutSection) {
        return;
      } else {
        cy.get('[aria-label="Clear"]', { timeout: 60000 }).click();
        cy.get(".NXConfirmButtonOk"), { timeout: 60000 }.click();
      }
    });
  });

  describe("Chart Workflow", () => {
    it.only("should complete full chart workflow with viewport changes", () => {
      // 1) Open the Templates panel
      cy.get(
        '[aria-label="Click to get the Templates of Desktop and Mobile devices."]',
        { timeout: 60000 }
      ).click();
      cy.get('[aria-label="layout_section1"]', { timeout: 60000 }).should(
        "exist"
      );

      // 2) Drag the Chart icon into section 1
      cy.get('[data-testid="Chart"]', { timeout: 60000 })
        .scrollIntoView()
        .should("exist")
        .trigger("mousedown", { which: 1, force: true });

      cy.get('[aria-label="layout_section1"]', { timeout: 60000 })
        .trigger("mousemove")
        .trigger("mouseup", { force: true });

      cy.get('#Chart1', { timeout: 60000 }).click();

      // 3) Open the Properties tab
      cy.get(".grid-align-container > :nth-child(5)", {
        timeout: 60000,
      }).click();
    });
  });
});
