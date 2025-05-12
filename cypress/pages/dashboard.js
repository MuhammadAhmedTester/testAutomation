/// <reference types="cypress" />
class DashboardPage{
    loginPage = {
    //page  elements
    emailField: () => cy.get('[data-cy="login-form-email-input"]', { timeout: 40000 }),
    passwordField: () => cy.get('[data-cy="login-form-password-input"]', { timeout: 40000 }),
    loginButton: () => cy.get('[data-cy="login-form-submit-button"]', { timeout: 40000 })
    };

    dashboardElements = {
      calendarButton: () => cy.get('[title="Calendar"]') , 
      calendarMonthBar: () => cy.get('[data-cy="monthly-rescheduler-navigation"]', { timeout: 40000 }),
      dragableCard: () => cy.get('[data-booking-id="318813e5-fc23-46e5-b770-23758dfe8d24"]', { timeout: 40000 }),
      dropCalendarSlot: () => cy.get('[data-cy="monthly-rescheduler-time-slot-2025-05-11-12:00-interactive"] > .justify-between > .space-x-2', { timeout: 40000 }),
      previousDayButton: () => cy.get('[title="Previous Day"]', { timeout: 40000 }),
      screenLoader: () => cy.get('.h-screen > .flex > .h-8', { timeout: 40000 }).should("not.exist"),
      profileButton: () => cy.get('.aspect-square', { timeout: 40000 }),
      logoutButton: () => cy.get('[role="menuitem"]', { timeout: 40000 }).eq(2),
      reDropCalendarSlot: () => cy.get('[data-cy="monthly-rescheduler-time-slot-2025-05-12-11:00-interactive"]', { timeout: 40000 })
    }

    waitForScreenToLoad(){
        this.dashboardElements.screenLoader();
    }


}

export default DashboardPage;