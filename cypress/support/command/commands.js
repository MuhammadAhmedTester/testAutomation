
Cypress.Commands.add('simpleDragDrop', (fromSelOrEl, toSelOrEl) => {
  const wrap = v => (Cypress.dom.isJquery(v) || v?.nodeType) ? cy.wrap(v) : cy.get(v);
  return wrap(fromSelOrEl).then($from => {
    return wrap(toSelOrEl).then($to => {
      const doc = $from[0].ownerDocument;
      const fr = $from[0].getBoundingClientRect();
      const tr = $to[0].getBoundingClientRect();
      const start = { x: fr.left + fr.width / 2, y: fr.top + fr.height / 2 };
      const end   = { x: tr.left + tr.width / 2, y: tr.top + tr.height / 2 };
      $from[0].dispatchEvent(new PointerEvent('pointerdown', {
        bubbles: true, pointerId: 1, button: 0, buttons: 1,
        clientX: start.x, clientY: start.y
      }));
      doc.dispatchEvent(new PointerEvent('pointermove', {
        bubbles: true, pointerId: 1, buttons: 1, clientX: end.x, clientY: end.y
      }));
      $to[0].dispatchEvent(new PointerEvent('pointerup', {
        bubbles: true, pointerId: 1, button: 0, clientX: end.x, clientY: end.y
      }));
      return cy.wrap(true, { log: false });
    });
  });
});
