Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('body').should('be.visible');
  cy.get('#welcome, .welcome-container, [name="Create Templates"]').should('exist', { timeout: 30000 });
});

Cypress.Commands.add('dragAndDrop', { prevSubject: 'element' }, (subject, targetSelector) => {
  cy.wrap(subject)
    .trigger('mouseover')
    .trigger('mousedown', { which: 1, button: 0 })
    .wait(100);
  
  cy.get(targetSelector)
    .trigger('mousemove')
    .trigger('mouseup', { force: true });
});

Cypress.Commands.add('waitForElementStable', { prevSubject: 'element' }, (subject, timeout = 5000) => {
  let previousPosition = null;
  let stableCount = 0;
  const maxStableChecks = 3;
  
  return new Cypress.Promise((resolve) => {
    const checkStability = () => {
      cy.wrap(subject).then(($el) => {
        const currentPosition = $el.offset();
        
        if (previousPosition && 
            Math.abs(currentPosition.left - previousPosition.left) < 1 &&
            Math.abs(currentPosition.top - previousPosition.top) < 1) {
          stableCount++;
          if (stableCount >= maxStableChecks) {
            resolve();
            return;
          }
        } else {
          stableCount = 0;
        }
        
        previousPosition = currentPosition;
        setTimeout(checkStability, 500);
      });
    };
    
    checkStability();
    setTimeout(() => resolve(), timeout);
  });
});

Cypress.Commands.add('changeViewport', (deviceType) => {
  const viewportConfigs = {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1280, height: 720 }
  };
  
  const config = viewportConfigs[deviceType];
  if (config) {
    cy.viewport(config.width, config.height);
    cy.wait(1000);
  }
});

Cypress.Commands.add('isInViewport', { prevSubject: 'element' }, (subject) => {
  cy.wrap(subject).then(($el) => {
    const rect = $el[0].getBoundingClientRect();
    const isInViewport = (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
    expect(isInViewport).to.be.true;
  });
});

Cypress.Commands.add('handleNetworkError', (urlPattern, statusCode = 500) => {
  cy.intercept('GET', urlPattern, { statusCode }).as('networkError');
  cy.wait('@networkError');
});

Cypress.Commands.add('measurePerformance', (operation) => {
  const startTime = performance.now();
  
  return new Cypress.Promise((resolve) => {
    operation().then(() => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      cy.log(`Performance measurement: ${duration.toFixed(2)}ms`);
      resolve(duration);
    });
  });
});

Cypress.Commands.add('verifyAccessibility', { prevSubject: 'element' }, (subject) => {
  cy.wrap(subject).should('have.attr', 'aria-label');
  cy.wrap(subject).should('be.visible');
  cy.wrap(subject).should('not.have.attr', 'aria-hidden', 'true');
});

Cypress.Commands.add('waitForDynamicContent', (selector, timeout = 10000) => {
  cy.get(selector, { timeout }).should('exist');
  cy.get(selector).should('be.visible');
  cy.get(selector).should('not.have.class', 'loading');
});

Cypress.Commands.add('retryOperation', (operation, maxRetries = 3) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return operation();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        cy.wait(1000);
      }
    }
  }
  
  throw lastError;
});

Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
  const defaultOptions = {
    timeout: 60000,
    failOnStatusCode: false,
    retryOnNetworkFailure: true
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  return originalFn(url, mergedOptions);
});

Cypress.Commands.add('verifyChartProperties', (chartSelector) => {
  cy.get(chartSelector).should('exist');
  cy.get(chartSelector).should('be.visible');
  cy.get(chartSelector).should('have.attr', 'data-testid');
  cy.get(chartSelector).should('not.have.class', 'loading');
});

Cypress.Commands.add('handleModal', (action = 'close') => {
  cy.get('body').then(($body) => {
    if ($body.find('.modal, .dialog, [role="dialog"]').length > 0) {
      if (action === 'close') {
        cy.get('.modal, .dialog, [role="dialog"]').find('.close, [aria-label="Close"]').click();
      }
    }
  });
});