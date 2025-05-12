import { login_credentials } from '../datafiles/e2e_files/login';
// const logCreds = new login_credentials();
import 'cypress-drag-drop';
import DashboardPage from '../pages/dashboard';
// const dp = new DashboardPage();

describe("Dashboard test validation", { testIsolation: false }, () => {
    let dashboardPage;
    
    before(() => {
        // cy.viewport('macbook-16')
        dashboardPage = new DashboardPage();
        cy.visit('en/login');
        cy.wait(660);
        // DashboardPage.waitForScreenToLoad();
        cy.get('body').then(($body) => {
            if ($body.find('.aspect-square').length > 0) {
                cy.log('Element is present!');
                dashboardPage.dashboardElements.profileButton().click();
                dashboardPage.dashboardElements.logoutButton().click();
                cy.wait(2000);
            } else {
                return
            }
        });
    })
    after(() => {
        const dataTransfer = new DataTransfer();
        dashboardPage.dashboardElements.dragableCard().trigger('mousedown', { which: 1 }).trigger('dragstart', { dataTransfer });
        dashboardPage.dashboardElements.reDropCalendarSlot().trigger('dragenter', { dataTransfer }).trigger('dragover', { dataTransfer })
            .trigger('drop', { dataTransfer })
            .trigger('mouseup', { force: true });
        // cy.contains("Booking Rescheduled");
    })
    let email = "gabemata@gmail.com";
    let pass = "123456789"
    it("Login", () => {
        const dataTransfer = new DataTransfer();
        //login
        dashboardPage.loginPage.emailField().type(email);
        dashboardPage.loginPage.passwordField().type(pass);
        dashboardPage.loginPage.loginButton().click();
        cy.wait(4000)
        dashboardPage.dashboardElements.dragableCard().should("exist");
    })
    it("rescheduling the reservation", () => {
        // rescheduling the reservation
        const dataTransfer = new DataTransfer();
        dashboardPage.dashboardElements.calendarButton().should('exist').click();
        dashboardPage.dashboardElements.dragableCard().trigger('mousedown', { which: 1 }).trigger('dragstart', { dataTransfer });
        dashboardPage.dashboardElements.dropCalendarSlot().trigger('dragenter', { dataTransfer }).trigger('dragover', { dataTransfer })
            .trigger('drop', { dataTransfer })
            .trigger('mouseup', { force: true });

        // cy.contains("Booking Rescheduled");
    });
    it("validation of rescheduling of the reservation", () => {
        //validation of rescheduling of the reservation
        dashboardPage.dashboardElements.previousDayButton().click();
        dashboardPage.dashboardElements.calendarMonthBar().should("exist");
        dashboardPage.dashboardElements.dragableCard().should("exist");

    });
})