
// Fix: handle both jQuery objects and DOM elements
Cypress.Commands.add('simpleDragDrop', (fromSelOrEl, toSelOrEl) => {
  const getEl = v => Cypress.dom.isJquery(v) ? v[0] : v;
  return cy.get(fromSelOrEl).then($from => {
    return cy.get(toSelOrEl).then($to => {
      const fromEl = getEl($from);
      const toEl = getEl($to);
      const doc = fromEl.ownerDocument;
      const fr = fromEl.getBoundingClientRect();
      const tr = toEl.getBoundingClientRect();
      const start = { x: fr.left + fr.width / 2, y: fr.top + fr.height / 2 };
      const end   = { x: tr.left + tr.width / 2, y: tr.top + tr.height / 2 };
      fromEl.dispatchEvent(new PointerEvent('pointerdown', {
        bubbles: true, pointerId: 1, button: 0, buttons: 1,
        clientX: start.x, clientY: start.y
      }));
      doc.dispatchEvent(new PointerEvent('pointermove', {
        bubbles: true, pointerId: 1, buttons: 1, clientX: end.x, clientY: end.y
      }));
      toEl.dispatchEvent(new PointerEvent('pointerup', {
        bubbles: true, pointerId: 1, button: 0, clientX: end.x, clientY: end.y
      }));
      return cy.wrap(true, { log: false });
    });
  });
});
