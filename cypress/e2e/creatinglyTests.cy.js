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
    cy.contains("Loading Design, Please wait..", { timeout: 60000 }).should("not.exist");


    // Check if we're in the layout section, if not create master page
    cy.get('body').then(($body) => {
      const hasLayoutSection = $body.find('#section1.layout-style').length > 0;
      if (!hasLayoutSection) {
        return
      } else {
        cy.get('[aria-label="Clear"]').click();
        cy.get('.NXConfirmButtonOk').click();
      }
    });
  });

  it.only("should complete full chart workflow with viewport changes", () => {
    cy.get('[aria-label="Click to get the Templates of Desktop and Mobile devices."]').click();
    cy.get('[aria-label="layout_section1"]').should("exist");

    cy.get('[data-testid="Chart"]').should("exist");
    cy.get('[data-testid="Chart"]').should("exist").trigger("mouseover");
    cy.get('[data-testid="Pie Chart"]').should("exist").trigger("mousedown", { which: 1, button: 0 });
    cy.get('[aria-label="layout_section1"]').trigger("mousemove").trigger("mouseup", { force: true });

    cy.get('[title="Properties"]').click();
    cy.get("div.grid-align-container > button.btn").eq(4).click();

  });


});

