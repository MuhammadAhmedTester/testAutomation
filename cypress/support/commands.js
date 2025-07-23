Cypress.Commands.add('waitForPageLoad', () => {
  // Wait for the page to be fully loaded
  cy.get('body').should('be.visible');
  
  // Wait for any of the expected elements to appear with better error handling
  cy.get('body', { timeout: 40000 }).then(($body) => {
    // Check if any of the expected elements exist
    const welcomeElement = $body.find('#welcome.welcome-container').length > 0;
    const createTemplatesBtn = $body.find('[name="Create Templates"]').length > 0;
    const welcomeContainer = $body.find('.welcome-container').length > 0;
    
    if (!welcomeElement && !createTemplatesBtn && !welcomeContainer) {
      // If none of the expected elements are found, wait a bit more and try again
      cy.wait(2000);
      cy.get('#welcome.welcome-container, [name="Create Templates"], .welcome-container', { timeout: 30000 })
        .should('exist');
    }
  });
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

Cypress.Commands.add('waitForAppToLoad', () => {
  // More robust page loading command that handles various loading states
  cy.get('body').should('be.visible');
  
  // Wait for network requests to complete
  cy.intercept('**/*').as('allRequests');
  cy.wait('@allRequests', { timeout: 30000 }).then(() => {
    // After network requests complete, check for expected elements
    cy.get('body').then(($body) => {
      const hasWelcome = $body.find('#welcome.welcome-container').length > 0;
      const hasCreateTemplates = $body.find('[name="Create Templates"]').length > 0;
      const hasWelcomeContainer = $body.find('.welcome-container').length > 0;
      
      if (!hasWelcome && !hasCreateTemplates && !hasWelcomeContainer) {
        // If no expected elements found, wait for any loading indicators to disappear
        cy.get('.loading, .spinner, [data-testid="loading"]', { timeout: 10000 }).should('not.exist');
        
        // Then try to find the elements again
        cy.get('#welcome.welcome-container, [name="Create Templates"], .welcome-container', { timeout: 20000 })
          .should('exist');
      }
    });
  });
});